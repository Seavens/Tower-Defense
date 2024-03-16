// Resourced from Littensy: https://github.com/littensy/slither
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { MarketplaceService } from "@rbxts/services";
import { useAsync } from "@rbxts/pretty-react-hooks";

export function useProductPrice(productId: number) {
	const [info = "N/A"] = useAsync(() => {
		return Promise.retryWithDelay(
			async () => {
				return MarketplaceService.GetProductInfo(productId, Enum.InfoType.Product).PriceInRobux;
			},
			10,
			5,
		);
	});

	return info;
}
