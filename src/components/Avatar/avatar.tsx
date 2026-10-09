import { useState } from "react";
import { cn } from "#/lib/classname";
import Styles from "./avatar.module.css";
import { getGradient, getInitials } from "./utils";

export interface AvatarProps extends React.ComponentProps<"div"> {
	src: string;
	alt: string;
	size?: number;
}

export function Avatar({
	src,
	alt,
	size = 72,
	className,
	style,
	...props
}: AvatarProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const failed = failedSrc === src;

	return (
		<div
			{...props}
			className={cn(Styles.avatar, className)}
			style={{ width: size, height: size, ...style }}
		>
			{failed || !src ? (
				<span
					className={cn(
						Styles.fallback,
						Styles[`gradient_${getGradient(alt)}`],
					)}
					role="img"
					aria-label={alt}
				>
					{getInitials(alt)}
				</span>
			) : (
				<img
					className={Styles.image}
					src={src}
					alt={alt}
					onError={() => setFailedSrc(src)}
				/>
			)}
		</div>
	);
}
