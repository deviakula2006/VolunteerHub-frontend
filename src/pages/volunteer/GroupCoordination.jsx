import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import InputField from "../../components/ui/InputField";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { Users, UserPlus, Check, X, Shield, Megaphone, Send } from "lucide-react";
import { getGroupAnnouncements, postAnnouncement } from "../../services/messageService";
import { supabase } from "../../config/supabaseClient";

export default function GroupCoordination() {
    const [groups, setGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newGroupName, setNewGroupName] = useState("");
    const [opportunityId, setOpportunityId] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const [inviteEmail, setInviteEmail] = useState("");
    const [activeGroupId, setActiveGroupId] = useState(null);

    const [announcements, setAnnouncements] = useState({}); // { groupId: [announcements] }
    const [showAnnouncements, setShowAnnouncements] = useState({}); // { groupId: boolean }
    const [newAnnouncement, setNewAnnouncement] = useState("");

    useEffect(() => {
        fetchGroups();
        fetchPublicGroups();

        // Real-time subscription for announcements
        const channel = supabase
            .channel("public:announcements")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "announcements" },
                (payload) => {
                    if (payload.new.group_id) {
                        fetchAnnouncements(payload.new.group_id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await api.get("/groups");
            setGroups(res.data);
            // Auto-fetch announcements for accepted groups
            res.data.forEach(mem => {
                if (mem.status === 'accepted') {
                    fetchAnnouncements(mem.group.id);
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPublicGroups = async () => {
        try {
            const res = await api.get("/groups/public");
            setPublicGroups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAnnouncements = async (groupId) => {
        try {
            const data = await getGroupAnnouncements(groupId);
            setAnnouncements(prev => ({ ...prev, [groupId]: data }));
        } catch (err) {
            console.error(`Error fetching announcements for ${groupId}:`, err);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName || !opportunityId) return;
        setIsCreating(true);
        try {
            await api.post("/groups", {
                name: newGroupName,
                opportunity_id: opportunityId,
            });
            setNewGroupName("");
            setOpportunityId("");
            fetchGroups();
            alert("Group created! Now you can invite friends.");
        } catch (err) {
            alert(err.response?.data?.error || "Error creating group");
        } finally {
            setIsCreating(false);
        }
    };

    const handleInvite = async (e, groupId) => {
        e.preventDefault();
        if (!inviteEmail) return;
        try {
            await api.post(`/groups/${groupId}/invite`, { invitee_email: inviteEmail });
            setInviteEmail("");
            setActiveGroupId(null);
            alert("Invitation sent!");
            fetchGroups();
        } catch (err) {
            alert(err.response?.data?.error || "Error sending invite");
        }
    };

    const handleRespond = async (groupId, status) => {
        try {
            await api.put(`/groups/${groupId}/respond`, { status });
            fetchGroups();
            fetchPublicGroups();
        } catch (err) {
            alert("Error responding to invite");
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            await api.post(`/groups/${groupId}/join`);
            alert("Joined group!");
            fetchGroups();
            fetchPublicGroups();
        } catch (err) {
            alert(err.response?.data?.error || "Error joining group");
        }
    };

    const handlePostAnnouncement = async (e, groupId) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;
        try {
            await postAnnouncement(groupId, newAnnouncement);
            setNewAnnouncement("");
            fetchAnnouncements(groupId);
        } catch (err) {
            alert(err.response?.data?.error || "Error posting announcement");
        }
    };

    const toggleAnnouncements = (groupId) => {
        setShowAnnouncements(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Group Volunteering</h1>
                        <p className="text-white/60">Organize events with friends and build your community team.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <GlassCard>
                            <h2 className="text-xl font-bold text-white mb-6">Create a Group</h2>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <InputField
                                    label="Group Name"
                                    placeholder="e.g. Eco Warriors"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    required
                                />
                                <InputField
                                    label="Opportunity ID"
                                    type="text"
                                    placeholder="Paste the Opportunity ID here..."
                                    value={opportunityId}
                                    onChange={(e) => setOpportunityId(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-4"
                                >
                                    {isCreating ? "Creating..." : "Create Group"}
                                </button>
                            </form>
                        </GlassCard>
                    </div>

                    <div className="md:col-span-2">
                        <GlassCard className="h-full">
                            <h2 className="text-xl font-bold text-white mb-6">Your Groups</h2>
                            {loading ? (
                                <Loader text="Loading your groups..." />
                            ) : groups.length > 0 ? (
                                <div className="space-y-4">
                                    {groups.map((membership) => (
                                        <div key={membership.group.id} className="p-5 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                                                        <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                                                        {membership.group.name}
                                                    </h3>
                                                    <p className="text-white/60 text-sm mt-1 flex flex-wrap gap-2 items-center">
                                                        <span className="truncate">Target: {membership.group.opportunities?.title || `Opp #${membership.group.opportunity_id}`}</span>
                                                        <span className="text-white/20 hidden sm:inline">|</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${membership.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                            }`}>
                                                            {membership.status.toUpperCase()}
                                                        </span>
                                                    </p>
                                                </div>

                                                {membership.status === 'pending' && (
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => handleRespond(membership.group.id, 'accepted')} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition">
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleRespond(membership.group.id, 'rejected')} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {membership.status === 'accepted' && (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                                                        <button
                                                            onClick={() => toggleAnnouncements(membership.group.id)}
                                                            className={`flex items-center gap-2 text-sm font-medium transition ${showAnnouncements[membership.group.id] ? 'text-emerald-400' : 'text-white/60 hover:text-white'}`}
                                                        >
                                                            <Megaphone className="w-4 h-4" /> Announcements {announcements[membership.group.id]?.length > 0 && `(${announcements[membership.group.id].length})`}
                                                        </button>

                                                        {activeGroupId === membership.group.id ? (
                                                            <form onSubmit={(e) => handleInvite(e, membership.group.id)} className="flex-1 flex gap-2 min-w-[200px]">
                                                                <input
                                                                    type="email"
                                                                    placeholder="Friend's email..."
                                                                    value={inviteEmail}
                                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                                    required
                                                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
                                                                />
                                                                <button type="submit" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-xs transition">
                                                                    Invite
                                                                </button>
                                                                <button type="button" onClick={() => setActiveGroupId(null)} className="px-2 py-1.5 text-white/50 hover:text-white transition text-xs">
                                                                    Cancel
                                                                </button>
                                                            </form>
                                                        ) : (
                                                            <button
                                                                onClick={() => setActiveGroupId(membership.group.id)}
                                                                className="flex items-center gap-2 text-sm text-white/60 hover:text-white font-medium transition"
                                                            >
                                                                <UserPlus className="w-4 h-4" /> Invite Friends
                                                            </button>
                                                        )}
                                                    </div>

                                                    {showAnnouncements[membership.group.id] && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <form onSubmit={(e) => handlePostAnnouncement(e, membership.group.id)} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Share something with the group..."
                                                                    value={newAnnouncement}
                                                                    onChange={(e) => setNewAnnouncement(e.target.value)}
                                                                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm italic"
                                                                />
                                                                <button type="submit" className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition shadow-lg shadow-emerald-500/20">
                                                                    <Send className="w-5 h-5" />
                                                                </button>
                                                            </form>

                                                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                                {announcements[membership.group.id]?.length > 0 ? (
                                                                    announcements[membership.group.id].map((msg) => (
                                                                        <div key={msg.id} className="p-3 rounded-xl bg-white/5 border border-white/5 group relative">
                                                                            <div className="flex justify-between items-start mb-1">
                                                                                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                                                                                    {msg.sender?.email?.split('@')[0]}
                                                                                </span>
                                                                                <span className="text-[10px] text-white/20">
                                                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-white/80 text-sm leading-relaxed">{msg.content}</p>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-center py-6 text-white/30 text-xs italic bg-white/5 rounded-xl border border-dashed border-white/10">
                                                                        No announcements yet.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/60">You are not in any groups yet.</p>
                                    <p className="text-white/40 text-sm mt-1">Create one to get started!</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Discover Groups</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicGroups.length > 0 ? (
                            publicGroups.map((group) => (
                                <GlassCard key={group.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{group.name}</h3>
                                            <p className="text-white/40 text-xs mt-1">Target: {group.opportunities?.title || `Opp #${group.opportunity_id}`}</p>
                                        </div>
                                        <Users className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <button
                                        onClick={() => handleJoinGroup(group.id)}
                                        className="w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 font-semibold transition mt-2"
                                    >
                                        Join Group
                                    </button>
                                </GlassCard>
                            ))
                        ) : (
                            <p className="text-white/40 col-span-full py-8 text-center bg-white/5 rounded-2xl border border-white/10 italic">
                                No public groups found. Why not create one?
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
