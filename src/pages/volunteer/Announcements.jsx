import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGroupAnnouncements, postAnnouncement } from '../../services/messageService';
import api from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import InputField from '../../components/ui/InputField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';

const Announcements = () => {
    const { user } = useAuth();
    const [myGroups, setMyGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchMyGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchAnnouncements(selectedGroup.id);
            const channel = subscribeToAnnouncements(selectedGroup.id);
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedGroup]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [announcements]);

    const fetchMyGroups = async () => {
        try {
            const res = await api.get('/groups');
            const accepted = res.data
                .filter(m => m.status === 'accepted' && m.group)
                .map(m => m.group);
            setMyGroups(accepted);
        } catch (err) {
            console.error("Error fetching groups:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async (groupId) => {
        try {
            const data = await getGroupAnnouncements(groupId);
            setAnnouncements(data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
        }
    };

    const subscribeToAnnouncements = (groupId) => {
        return supabase
            .channel(`group-announcements-${groupId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'announcements', filter: `group_id=eq.${groupId}` },
                async (payload) => {
                    const { data: profile } = await supabase
                        .from('profiles').select('id, email').eq('id', payload.new.sender_id).single();
                    setAnnouncements(prev => [{ ...payload.new, sender: profile }, ...prev]);
                }
            )
            .subscribe();
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !selectedGroup) return;
        try {
            await postAnnouncement(selectedGroup.id, newMsg);
            setNewMsg('');
        } catch (err) {
            console.error("Error posting announcement:", err);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="p-8 text-center text-white/50">Loading your groups...</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-[calc(100vh-100px)]">
                {!selectedGroup ? (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                            <p className="text-white/60">Stay updated with your volunteer groups</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.length > 0 ? (
                                myGroups.map((group) => (
                                    <GlassCard
                                        key={group.id}
                                        onClick={() => setSelectedGroup(group)}
                                    >
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400">
                                            <Users size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{group.name}</h3>
                                        <p className="text-sm text-white/50 mb-4 line-clamp-2">
                                            {group.opportunities?.title || 'Group Collaboration'}
                                        </p>
                                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                                            View Announcements <MessageSquare size={16} className="ml-2" />
                                        </div>
                                    </GlassCard>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16 text-white/50">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">You haven't joined any groups yet.</p>
                                    <p className="text-sm mt-2">Join a group from "Group Volunteering" to see announcements here.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col h-[calc(100vh-160px)]">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => { setSelectedGroup(null); setAnnouncements([]); }}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
                                <p className="text-xs text-white/40">Team Announcements</p>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 flex flex-col-reverse space-y-reverse space-y-4"
                            >
                                <AnimatePresence initial={false}>
                                    {announcements.length > 0 ? (
                                        announcements.map((ann) => (
                                            <motion.div
                                                key={ann.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`max-w-[75%] flex flex-col ${ann.sender_id === user?.id ? 'self-end items-end' : 'self-start items-start'
                                                    }`}
                                            >
                                                <span className="text-[10px] text-white/40 mb-1 font-medium px-1">
                                                    {ann.sender_id === user?.id ? 'You' : ann.sender?.email?.split('@')[0] || 'Teammate'}
                                                </span>
                                                <div className={`p-3 rounded-2xl text-sm ${ann.sender_id === user?.id
                                                    ? 'bg-emerald-500 text-white rounded-tr-none'
                                                    : 'bg-white/10 text-white rounded-tl-none'
                                                    }`}>
                                                    <p className="leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                                    <span className="text-[10px] opacity-60 block mt-1 text-right">
                                                        {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white/30">
                                            <p>No announcements yet. Post one below!</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input bar */}
                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <form onSubmit={handleSend} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={newMsg}
                                        onChange={(e) => setNewMsg(e.target.value)}
                                        placeholder="Post an announcement for your group..."
                                        className="flex-1 p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMsg.trim()}
                                        className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Announcements;
