"use client";

import React, { useEffect, useState } from "react";

interface FeedbackModalProps {
	open: boolean;
	onClose: () => void;
	defaultPage?: string;
}

export function FeedbackModal({ open, onClose, defaultPage }: FeedbackModalProps) {
	const [page, setPage] = useState("");
	const [response, setResponse] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		if (!open) {
			return;
		}
		setPage(defaultPage || "");
		setResponse("");
		setErrorMessage("");
		setSuccessMessage("");
	}, [open, defaultPage]);

	if (!open) {
		return null;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedPage = page.trim();
		const trimmedResponse = response.trim();

		if (!trimmedPage || !trimmedResponse) {
			setErrorMessage("Please fill in both fields.");
			setSuccessMessage("");
			return;
		}

		try {
			setIsSubmitting(true);
			setErrorMessage("");
			setSuccessMessage("");

			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					page: trimmedPage,
					response: trimmedResponse,
				}),
			});

			if (!res.ok) {
				let message = "Failed to submit feedback.";
				try {
					const data = await res.json();
					if (data?.error) {
						message = data.error;
					}
				} catch {
					// Ignore JSON parsing errors.
				}
				throw new Error(message);
			}

			setResponse("");
			setSuccessMessage("Thanks! Your feedback has been submitted.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to submit feedback.";
			setErrorMessage(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-white shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold">Share your feedback</h2>
						<p className="mt-1 text-sm text-neutral-400">
							Tell us what is working and what we can improve.
						</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-300 hover:text-white"
						type="button"
					>
						Close
					</button>
				</div>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-neutral-200" htmlFor="feedback-page">
							Page
						</label>
						<input
							id="feedback-page"
							name="page"
							type="text"
							value={page}
							onChange={(event) => setPage(event.target.value)}
							placeholder="/men/hostels"
							className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-neutral-200" htmlFor="feedback-response">
							Response
						</label>
						<textarea
							id="feedback-response"
							name="response"
							value={response}
							onChange={(event) => setResponse(event.target.value)}
							rows={5}
							placeholder="Tell us what you think..."
							className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
						/>
					</div>

					{errorMessage ? (
						<p className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
							{errorMessage}
						</p>
					) : null}
					{successMessage ? (
						<p className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
							{successMessage}
						</p>
					) : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? "Submitting..." : "Submit Feedback"}
					</button>
				</form>
			</div>
		</div>
	);
}
