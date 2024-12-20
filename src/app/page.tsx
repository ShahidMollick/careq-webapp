import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home({
	searchParams,
}: {
	searchParams?: { error?: string };
}) {
	const error = searchParams?.error || "";

	return (
		<div className="relative flex h-[100vh] w-[100vw] bg-white">
			{/* Background Image */}
			<div className="absolute inset-0">
				<img
					src="/login.jpg"
					alt="Hospital or Clinic"
					className="object-cover w-full h-full"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-80"></div>
			</div>

			{/* Login Card */}
			<div className="relative z-10 flex items-center justify-center w-full">
				<Card className="w-full max-w-md p-4 bg-white shadow-md">
					<CardHeader>
						<CardTitle className="text-start text-secondary text-2xl font-bold">
							Login to Your Account
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							action="/api/authenticate"
							method="POST"
							className="space-y-3"
						>
							{/* Username or Email */}
							<div>
								<Label htmlFor="email" className="text-sm font-medium">
									Email address
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									className="mt-2 w-full"
									required
								/>
							</div>

							{/* Password */}
							<div>
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter your password"
									className="mt-2 w-full"
									required
								/>
							</div>

							{/* Error Message */}
							{error && <p className="text-sm text-red-600">{error}</p>}

							{/* Sign In Button */}
							<Button type="submit" className="w-full">
								Sign In
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col items-start">
						<p className="text-start text-sm text-gray-500">
							Don’t have an account?{" "}
							<Link href="/register" className="text-primary hover:underline">
								Register your account
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
