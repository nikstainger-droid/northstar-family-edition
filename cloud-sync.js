/* Authenticated Supabase household sharing. Requires supabase-config.js and deployed SQL/Edge Functions. */
(async()=>{'use strict';
const emit=(message,detail={})=>window.dispatchEvent(new CustomEvent('northstar:cloud-status',{detail:{message,...detail}}));
const cfg=window.NORTHSTAR_SUPABASE_CONFIG||{};
if(!cfg.url||!cfg.anonKey||cfg.url.includes('YOUR-PROJECT')||cfg.anonKey.includes('YOUR_SUPABASE')){window.NorthstarCloud={configured:false};emit('Cloud sharing needs your Supabase project URL and public key in supabase-config.js.');return;}
try{
 const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.57.0');
 const client=createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 let householdId=localStorage.getItem('northstar-household-id')||'', channel=null, timer=null, applying=false;
 const current=()=>{let result=null;window.dispatchEvent(new CustomEvent('northstar:get-state',{detail:{set:v=>result=v}}));return result};
 const payload=()=>{const d=current();if(!d)return null;return {household:String(d.household||'Our household').slice(0,100),recipes:d.recipes||[],meals:d.meals||[],shopping:d.shopping||[],chores:d.chores||[],events:d.events||[],notices:d.notices||[]}};
 async function getUser(){const {data,error}=await client.auth.getUser();if(error)throw error;if(!data.user)throw Error('Sign in first.');return data.user}
 async function stopChannel(){if(channel){await client.removeChannel(channel);channel=null}}
 async function pull(){if(!householdId)return;const {data,error}=await client.from('shared_records').select('data,updated_at').eq('household_id',householdId).eq('record_type','household_state').maybeSingle();if(error)throw error;if(data?.data){applying=true;window.dispatchEvent(new CustomEvent('northstar:apply-remote',{detail:{data:data.data,source:'cloud'}}));applying=false;emit('Connected. Household data loaded from cloud.');return true}return false}
 async function push(){if(!householdId||applying)return;const user=await getUser(), state=payload();if(!state)return;const {error}=await client.from('shared_records').upsert({household_id:householdId,record_type:'household_state',data:state,created_by:user.id,updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:'household_id,record_type'});if(error)throw error;}
 async function connect(id){const user=await getUser();const {data:member,error}=await client.from('household_members').select('household_id').eq('household_id',id).eq('user_id',user.id).maybeSingle();if(error)throw error;if(!member)throw Error('Your account is not a member of that household. Use an invitation first.');householdId=id;localStorage.setItem('northstar-household-id',id);await stopChannel();const hasCloudData=await pull();if(!hasCloudData)await push();channel=client.channel('northstar-household-'+id).on('postgres_changes',{event:'*',schema:'public',table:'shared_records',filter:'household_id=eq.'+id},()=>pull().catch(e=>emit('Cloud refresh failed: '+e.message))).subscribe(status=>{if(status==='SUBSCRIBED')emit('Live household sync connected.');});emit('Household sharing connected.');}
 window.addEventListener('northstar:local-state',()=>{if(!householdId||applying)return;clearTimeout(timer);timer=setTimeout(()=>push().then(()=>emit('Changes saved to household cloud.')).catch(e=>emit('Cloud save failed: '+e.message)),700)});
 window.NorthstarCloud={configured:true,client, get householdId(){return householdId}, getUser,
 signIn:async email=>{const redirectTo=location.href.split('#')[0];const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo,shouldCreateUser:true}});if(error)throw error;return true},
 signOut:async()=>{await client.auth.signOut();await stopChannel();householdId='';localStorage.removeItem('northstar-household-id');emit('Signed out. Local browser data remains on this device.');},
 createHousehold:async name=>{await getUser();const {data,error}=await client.rpc('create_household',{household_name:name});if(error)throw error;await connect(data);return data},
 createInvitation:async(id,expires_hours=72,max_uses=1)=>{const {data,error}=await client.functions.invoke('create-invitation',{body:{household_id:id,expires_hours,max_uses}});if(error)throw error;if(data?.error)throw Error(data.error);return data},
 redeemInvitation:async token=>{const {data,error}=await client.functions.invoke('redeem-invitation',{body:{token:token.trim()}});if(error)throw error;if(data?.error)throw Error(data.error);await connect(data.household_id);return data},
 connect, refresh:pull, push};
 const {data:{session}}=await client.auth.getSession();if(session&&householdId){try{await connect(householdId)}catch(e){emit('Saved household could not reconnect: '+e.message)}}else emit(session?'Signed in. Create a household or join with an invitation.':'Enter your email to sign in securely.');
 window.dispatchEvent(new CustomEvent('northstar:cloud-ready'));
}catch(e){console.error(e);window.NorthstarCloud={configured:false,error:e.message};emit('Cloud module failed to initialise: '+e.message)}
})();
