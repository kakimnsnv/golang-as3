"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import  {useRouter}  from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { set } from "zod";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Report = {
    id: string;
    title: string;
    grade: string;
    student_id: string;
}


export default function ReportsPage() {
    const { user, logout } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const router = useRouter();
    const addForm = useForm<Report>();
    const editForm = useForm<Report>();
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            const response = await api.get("/reports");
            if (response.data.error !== undefined) {
                console.error("Failed to fetch reports");
                return;
            }
            setReports(response.data);
        };
        fetchReports();
    }, []);

    const onLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const onSubmit = async (data: Report) => {
        try {
            const response = await api.post("/reports", data);
            if (response.data.error !== undefined) {
                console.error("Failed to create report");
                return;
            }
            setReports((prevReports) =>  [...prevReports, response.data]);
            addForm.reset();
            setDialogOpen(false);
        }catch (error) {
            console.error("Failed to create report");
        }
    }

    const onDelete = async (id: string) => {
        try {
            const response = await api.delete(`/reports/${id}`);
            if (response.data.error !== undefined) {
                console.error("Failed to delete report");
                return;
            }
            setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        } catch (error) {
            console.error("Failed to delete report");
        }
    }

    const onEdit = async (data: Report) => {
        try {
            const response = await api.put(`/reports/${data.id}`, data);
            if (response.data.error !== undefined) {
                console.error("Failed to create report");
                return;
            }
            const response2 = await api.get("/reports");
            if (response2.data.error !== undefined) {
                console.error("Failed to fetch reports");
                return;
            }
            setReports(response2.data);
            editForm.reset();
            setSelectedReportId(null);
        }catch (error) {
            console.error("Failed to create report");
        }
    }

    return (
        <ProtectedRoute roles={["admin", "user"]}>
            <div className="flex flex-row items-center justify-between p-10">
                <div className="flex flex-row items-center justify-start space-x-4">
                    <div>
                        <h1 className="text-3xl font-medium">Reports</h1>
                    </div>
                    {user?.role === "admin" &&
                    <Dialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant={"outline"} onClick={()=>{}}>Add Report</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Create Report</DialogTitle>
                                <DialogDescription>Form to create report.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={addForm.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                <FormField
                                    control={addForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <Input
                                            {...addForm.register("title", { required: true })}
                                            placeholder="Enter Title"
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <Input
                                            {...addForm.register("grade", { required: true })}
                                            placeholder="Enter Grade"
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="student_id"
                                    render={({ field }) => (
                                        <Input
                                            {...addForm.register("student_id", { required: true })}
                                            placeholder="Enter Student ID"
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <Button type="submit" onSubmit={addForm.handleSubmit(onSubmit)} >Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    }
                </div>
                <Button onClick={onLogout}>Logout</Button>
            </div>
            <div className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {reports.map((report) => (
                    <Card key={report.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{report.title}</CardTitle>
                            <CardDescription>Grade: {report.grade}</CardDescription>
                            <CardDescription>Student: {report.student_id}</CardDescription>
                        </CardHeader>
                        {user?.role === "admin" && (
                            <CardFooter className="flex space-x-2">
                                <Dialog
                    open={selectedReportId === report.id}
                    onOpenChange={(open) => setSelectedReportId(open ? report.id : null)}
                    >
                        <DialogTrigger asChild>
                            <Button variant={"outline"} onClick={()=>{}}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Update Report</DialogTitle>
                                <DialogDescription>Form to update report.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={editForm.handleSubmit(onEdit)} className="grid gap-4 py-4">
                                <FormField
                                    control={editForm.control}
                                    name="id"
                                    render={({ field }) => (
                                        <Input
                                            {...editForm.register("id", { required: true })}
                                            // placeholder={report.id}
                                            value={report.id}
                                            className="col-span-3 hidden"
                                        />
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <Input
                                            {...editForm.register("title", { required: true })}
                                            placeholder={report.title}
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <Input
                                            {...editForm.register("grade", { required: true })}
                                            placeholder={report.grade}
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="student_id"
                                    render={({ field }) => (
                                        <Input
                                            {...editForm.register("student_id", { required: true })}
                                            placeholder={report.student_id}
                                            className="col-span-3"
                                        />
                                    )}
                                />
                                <Button type="submit" onSubmit={editForm.handleSubmit(onEdit)} >Submit</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                                <Button variant="destructive" onClick={() => onDelete(report.id)}>Delete</Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </ProtectedRoute>
    );
}