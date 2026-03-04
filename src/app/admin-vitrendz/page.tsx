"use client";

import React, { useEffect, useState } from "react";

type FeedbackItem = {
	id?: number | string;
	page: string;
	response: string;
	created_at?: string;
	createdAt?: string;
};

export default function AdminVitrendzPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [isAuthLoading, setIsAuthLoading] = useState(false);
	const [isAuthed, setIsAuthed] = useState(false);
	const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState("");

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			setIsAuthLoading(true);
			setAuthError("");

			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "same-origin",
				body: JSON.stringify({
					email: username,
					password,
					role: "admin",
				}),
			});

			const data = await response.json().catch(() => null);
			if (!response.ok) {
				setAuthError(data?.error ?? "Invalid credentials.");
				setIsAuthed(false);
				return;
			}
			

			setIsAuthed(true);
		} catch {
			setAuthError("Unable to login right now. Please try again.");
			setIsAuthed(false);
		} finally {
			setIsAuthLoading(false);
		}
	};

	useEffect(() => {
		if (!isAuthed) {
			return;
		}

		const loadFeedbacks = async () => {
			try {
				setIsLoading(true);
				setLoadError("");
				const res = await fetch("/api/feedback");
				if (!res.ok) {
					throw new Error("Failed to load feedback.");
				}
				const data = await res.json();
				setFeedbacks(Array.isArray(data) ? data : []);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load feedback.";
				setLoadError(message);
			} finally {
				setIsLoading(false);
			}
		};

		loadFeedbacks();
	}, [isAuthed]);

	const formatDate = (value?: string) => {
		if (!value) {
			return "-";
		}
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "-";
		}
		return date.toLocaleString();
	};

	return (
		<div className="min-h-screen bg-black px-4 py-12 text-white">
			<div className="mx-auto w-full max-w-5xl">
				<h1 className="text-3xl font-semibold">Vitrendz Feedback Admin</h1>
				<p className="mt-2 text-sm text-neutral-400">
					Role-based access for reviewing feedback submissions.
				</p>

				{!isAuthed ? (
					<form
						onSubmit={handleLogin}
						className="mt-8 w-full max-w-md space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
					>
						<div className="space-y-2">
							<label className="text-sm font-medium text-neutral-200" htmlFor="admin-username">
								Username
							</label>
							<input
								id="admin-username"
								name="username"
								type="text"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
								className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
								placeholder="admin@example.com"
								required
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-neutral-200" htmlFor="admin-password">
								Password
							</label>
							<input
								id="admin-password"
								name="password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
								placeholder="Enter password"
								required
							/>
						</div>
						{authError ? (
							<p className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
								{authError}
							</p>
						) : null}
						<button
							type="submit"
							disabled={isAuthLoading}
							aria-busy={isAuthLoading}
							className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isAuthLoading ? "Logging in..." : "Login"}
						</button>
					</form>
				) : (
					<div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<h2 className="text-xl font-semibold">Feedback submissions</h2>
							<button
								onClick={() => setIsAuthed(false)}
								className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:text-white"
								type="button"
							>
								Sign out
							</button>
						</div>

						{isLoading ? (
							<p className="mt-4 text-sm text-neutral-400">Loading feedback...</p>
						) : null}
						{loadError ? (
							<p className="mt-4 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
								{loadError}
							</p>
						) : null}

						<div className="mt-6 overflow-hidden rounded-lg border border-neutral-800">
							<table className="w-full text-left text-sm">
								<thead className="bg-neutral-950 text-neutral-300">
									<tr>
										<th className="px-4 py-3 font-medium">Page</th>
										<th className="px-4 py-3 font-medium">Response</th>
										<th className="px-4 py-3 font-medium">Created Date</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-800">
									{feedbacks.length === 0 && !isLoading ? (
										<tr>
											<td
												colSpan={3}
												className="px-4 py-6 text-center text-neutral-500"
											>
												No feedback submitted yet.
											</td>
										</tr>
									) : null}
									{feedbacks.map((item) => (
										<tr key={item.id ?? `${item.page}-${item.response}`}>
											<td className="px-4 py-4 text-neutral-200">{item.page}</td>
											<td className="px-4 py-4 text-neutral-200">{item.response}</td>
											<td className="px-4 py-4 text-neutral-400">
												{formatDate(item.created_at ?? item.createdAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
