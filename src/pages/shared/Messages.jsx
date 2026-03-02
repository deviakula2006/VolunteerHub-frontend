import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import InputField from "../../components/ui/InputField";
import { getMessages, sendMessage } from "../../services/messageService";
import { Send } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMsgs();
  }, []);

  const fetchMsgs = async () => {
    try {
      const data = await getMessages();
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!receiverId || !newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(receiverId, newMessage);
      setNewMessage("");
      fetchMsgs();
    } catch (err) {
      alert("Error sending message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto h-[calc(100vh-64px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-white/60">Communicate with volunteers and organizations.</p>
        </div>

        <div className="flex-1 grid md:grid-cols-3 gap-6 min-h-0">
          <GlassCard className="md:col-span-1 overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold text-white sticky top-0 bg-[#0f172a] pb-2 z-10">
              New Message
            </h2>
            <form onSubmit={handleSend} className="space-y-4">
              <InputField
                label="Receiver ID"
                type="number"
                placeholder="e.g. 2"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80 ml-1">Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
                  rows={4}
                  required
                />
              </div>
              <PrimaryButton type="submit" className="w-full flex justify-center items-center gap-2" disabled={isSending}>
                <Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Send"}
              </PrimaryButton>
            </form>
          </GlassCard>

          <GlassCard className="md:col-span-2 flex flex-col min-h-0 relative">
            <h2 className="text-lg font-semibold text-white mb-4">Inbox</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {loading ? (
                <Loader text="Loading messages..." />
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-emerald-400 text-sm">
                        From: User #{msg.sender_id}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-white/50">
                  Your inbox is empty.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}