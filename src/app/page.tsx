import HomeHeader from "@/components/home-header";
import HomeHeroSection from "@/components/home-hero-section";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {prisma} from "@/lib/prisma";

export default async function Home() {
    const {isAuthenticated, getUser} = getKindeServerSession();
    const isLoggedIn = await isAuthenticated();

    let isPayingMember = false;

    const user = await getUser();

    if (user) {
        const membership = await prisma.membership.findFirst({
            where: {
                userId: user.id,
                status: "active",
            },
        });
        if (membership) {
            isPayingMember = true;
        }
    }
    return (
        <div className="bg-gray-950 relative h-screen w-screen">
            <div
                className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_60%_100%,transparent_10%,var(--color-background)_75%)]"></div>
            <HomeHeader isLoggedIn={isLoggedIn} isPayingMember={isPayingMember}/>
            <HomeHeroSection/>
        </div>
    );
}
