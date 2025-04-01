"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";

interface ContactsProps {
    chatbotId: string;
}

export default function Contacts({ chatbotId }: ContactsProps) {
    const [leads, setLeads] = useState([]);
    const [nameEnabled, setNameEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [phoneEnabled, setPhoneEnabled] = useState(true);
    const [customQuestions, setCustomQuestions] = useState<string[]>([]);

    useEffect(() => {
        fetchLeads();
        fetchSettings();
    }, [chatbotId]);

    const fetchLeads = async () => {
        try {
            const response = await fetch(`/api/chatbot/lead?chatbotId=${chatbotId}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLeads(data);
            console.log(data)
        } catch (error) {
            toast.error("Failed to load leads " + error.message)
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch(`/api/chatbot/leads-settings?chatbotId=${chatbotId}`);
            const data = await response.json();

            if (data) {
                setNameEnabled(data.nameEnabled ?? true);
                setEmailEnabled(data.emailEnabled ?? true);
                setPhoneEnabled(data.phoneEnabled ?? true);
                setCustomQuestions(data.customQuestions ?? []);
            }
        } catch (error) {
            toast.error("Failed to load settings " + error.message);
        }
    };

    const formatDate = (dateString: string) => {
        let date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-2">Lead Results</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="text-sm">
                        Connect to Google Sheets
                    </Button>
                    {/* Link to Google Sheet (will be populated when connected) */}
                    <a href="#" className="text-blue-500 hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                        View Sheet
                    </a>
                </div>
            </div>
            <Card className="mt-4">
                {leads.length > 0 &&
                    <div className="">
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th> {/* Add this line */}
                                    {nameEnabled && <th className="px-4 py-2 text-left">Name</th>}
                                    {emailEnabled && <th className="px-4 py-2 text-left">Email</th>}
                                    {phoneEnabled && <th className="px-4 py-2 text-left">Phone</th>}
                                    <th className="px-4 py-2 text-left">Custom Questions</th>
                                    <th className="px-4 py-2 text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        {nameEnabled && <td className="border px-4 py-2">{lead.name}</td>}
                                        {emailEnabled && <td className="border px-4 py-2">{lead.email}</td>}
                                        {phoneEnabled && <td className="border px-4 py-2">{lead.phone}</td>}
                                        <td className="border px-4 py-2">
                                            <div className="contacts-tooltip">
                                                <button>View Answers</button>
                                                <div className="contacts-tooltip-content">
                                                    <table className="p-4">
                                                        {customQuestions.map((question, index) => (
                                                            <tr key={index} className="">
                                                                <td className="pl-2"><strong>{question}:</strong></td>
                                                                <td>{lead.customAnswers?.[question] || 'No answer'}</td>
                                                            </tr>
                                                        ))}
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2">{formatDate(lead.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>}
                {leads.length == 0 && 
                    <div className="p-4">
                        No Results
                    </div>
                }
            </Card>
        </div>
    )
}