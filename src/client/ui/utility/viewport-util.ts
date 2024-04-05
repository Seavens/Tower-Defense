export interface ViewportCalculations {
	yFov: number;
	yTan: number;
	xFov: number;
	xTan: number;
	cFov: number;
	cSin: number;
}

const BLOCK = [0, 1, 2, 3, 4, 5, 6, 7];
const WEDGE = [0, 1, 3, 4, 5, 7];
const CORNER_WEDGE = [0, 1, 4, 5, 6];

export class ViewportUtility {
	public static getIndices(part: BasePart): Array<number> {
		if (part.IsA("WedgePart")) {
			return WEDGE;
		} else if (part.IsA("CornerWedgePart")) {
			return CORNER_WEDGE;
		}
		return BLOCK;
	}

	public static getCorners(cf: CFrame, size: Vector3, indices: Array<number>): Array<Vector3> {
		const corners = new Array<Vector3>();
		for (const j of $range(1, indices.size())) {
			const i = indices[j - 1];
			const corner = cf.mul(
				size.mul(
					new Vector3(2 * (math.floor(i / 4) % 2) - 1, 2 * (math.floor(i / 4) % 2) - 1, 2 * (i % 2) - 1),
				),
			);
			corners[j - 1] = corner;
		}
		return corners;
	}

	public static getModelPointCloud(model: Model): Array<Vector3> {
		const points = new Array<Vector3>();
		const descendants = model.GetDescendants();
		for (const part of descendants) {
			if (!part.IsA("BasePart")) {
				continue;
			}
			const indices = this.getIndices(part);
			const corners = this.getCorners(part.CFrame, part.Size.div(2), indices);
			for (const corner of corners) {
				points.push(corner);
			}
		}
		return points;
	}

	public static viewProjectionEdgeHits(
		cloud: Array<Vector3>,
		axis: "X" | "Y",
		depth: number,
		tan: number,
	): [max: number, min: number] {
		let max = -math.huge;
		let min = math.huge;
		for (const point of cloud) {
			const distance = depth - point.Z;
			const span = tan * distance;
			const a = point[axis] + span;
			const b = point[axis] - span;
			max = math.max(max, a, b);
			min = math.min(min, a, b);
		}
		return [max, min];
	}

	public static calibrateViewport(viewport: ViewportFrame, camera: Camera): ViewportCalculations {
		const size = viewport.AbsoluteSize;
		const aspect = size.X / size.Y;
		const yFov = math.rad(camera.FieldOfView / 2);
		const yTan = math.tan(yFov);
		const xFov = math.atan(yTan * aspect);
		const xTan = math.tan(xFov);
		const cFov = math.atan(yTan * math.min(1, aspect));
		const cSin = math.sin(cFov);
		return { yFov, yTan, xFov, xTan, cFov, cSin };
	}

	public static getFitDistance(cframe: CFrame, size: Vector3, sinC: number, focus?: Vector3): number {
		const position = cframe.Position;
		const displacement = focus !== undefined ? position.sub(focus).Magnitude : 0;
		const radius = size.Magnitude / 2 + displacement;
		return radius / sinC;
	}

	public static getMinimumFitCFrame(
		points: Array<Vector3>,
		calculations: ViewportCalculations,
		orientation: CFrame,
	): CFrame {
		const rotation = orientation.sub(orientation.Position);
		const inverse = rotation.Inverse();
		const cloud = [inverse.mul(points[0])];
		let furthest = cloud[0].Z;
		for (const i of $range(2, points.size())) {
			const point = inverse.mul(points[i - 1]);
			furthest = math.min(furthest, point.Z);
			cloud[i - 1] = point;
		}
		const { xTan, yTan } = calculations;
		const [horizontalMax, horizontalMin] = this.viewProjectionEdgeHits(cloud, "X", furthest, xTan);
		const [verticalMax, verticalMin] = this.viewProjectionEdgeHits(cloud, "Y", furthest, yTan);
		const distance = math.max((horizontalMax - horizontalMin) / 2 / xTan, (verticalMax - verticalMin) / 2 / yTan);
		return orientation.mul(
			new CFrame((horizontalMax + horizontalMin) / 2, (verticalMax + verticalMin) / 2, furthest + distance),
		);
	}
}
