import { redirect } from "next/navigation";
export default async function MessageConversationAlias({params}:{params:Promise<{conversationId:string}>}){const{conversationId}=await params;redirect(`/dashboard/messages?conversation=${encodeURIComponent(conversationId)}`);}
