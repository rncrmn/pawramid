import {TrendingDownIcon, TrendingUpIcon} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type StatsCardProps = {
    title: string
    value: number
    trend: number
    trendLabel: string
    description: string
}

export function StatsCard({title, value, trend, trendLabel, description}: StatsCardProps) {
    const isPositive = trend >= 0

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    {value}
                </CardTitle>
                <div className="absolute right-4 top-4">
                    <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                        {isPositive ? (
                            <TrendingUpIcon className="size-3"/>
                        ) : (
                            <TrendingDownIcon className="size-3"/>
                        )}
                        {trend >= 0 ? '+' : ''}{trend}%
                    </Badge>
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {isPositive ? 'Up' : 'Down'} {trendLabel}{' '}
                    {isPositive ? (
                        <TrendingUpIcon className="size-4"/>
                    ) : (
                        <TrendingDownIcon className="size-4"/>
                    )}
                </div>
                <div className="text-muted-foreground">
                    {description}
                </div>
            </CardFooter>
        </Card>
    )
}