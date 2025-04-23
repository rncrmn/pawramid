import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PawPrint} from "lucide-react";
import PurchaseBtn from "@/components/purchase-btn";

export default async function HomeHeader({isLoggedIn, isPayingMember}: {
    isLoggedIn: boolean,
    isPayingMember: boolean
}) {
    return (
        <header className="w-full py-3">
            <div className="max-w-6xl mx-auto py-2 px-6">
                <div className="flex flex-wrap items-center justify-between">
                    <p className="font-medium text-2xl">
                        <Link href="/" className="flex gap-2 justify-center items-center"><PawPrint/> Pawramid</Link>
                    </p>
                    <div className="space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Button variant="outline" asChild>
                                    <LoginLink>Login</LoginLink>
                                </Button>
                                <Button asChild>
                                    <RegisterLink>Register</RegisterLink>
                                </Button>
                            </>
                        ) : !isPayingMember ? (
                            <PurchaseBtn/>
                        ) : (
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}