import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { CheckCircle2, XCircle, Users } from "lucide-react";

export default function JoinGroup() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("joining"); // joining, success, error
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const performJoin = async () => {
            try {
                await api.post(`/groups/${groupId}/join`);
                setStatus("success");
                // Wait 2 seconds then redirect
                setTimeout(() => navigate("/group-volunteering"), 2000);
            } catch (err) {
                setStatus("error");
                setErrorMsg(err.response?.data?.error || "Failed to join group. You might already be a member.");
            }
        };

        if (groupId) {
            performJoin();
        }
    }, [groupId, navigate]);

    return (
        <DashboardLayout>
            <div className="min-h-[80vh] flex items-center justify-center p-8">
                <GlassCard className="max-w-md w-full p-12 text-center space-y-6">
                    {status === "joining" && (
                        <div className="space-y-4">
                            <Loader text="Joining your group..." />
                            <p className="text-white/60">One moment while we process your invitation...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Joined Successfully!</h1>
                            <p className="text-white/60">Welcome to the team. Redirecting you to your groups...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                <XCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Oops!</h1>
                            <p className="text-white/60">{errorMsg}</p>
                            <button
                                onClick={() => navigate("/volunteer/groups")}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors mt-4"
                            >
                                Back to Groups
                            </button>
                        </div>
                    )}
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
