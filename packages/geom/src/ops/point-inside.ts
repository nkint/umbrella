import { IObjectOf } from "@thi.ng/api";
import { defmulti, Implementation2 } from "@thi.ng/defmulti";
import { IShape, Type } from "@thi.ng/geom-api";
import {
    pointInAABB,
    pointInCircle,
    pointInPolygon2,
    pointInRect,
    pointInSegment,
    pointInTriangle2
} from "@thi.ng/geom-isec";
import { isInArray, ReadonlyVec, Vec } from "@thi.ng/vectors";
import {
    AABB,
    Circle,
    Line,
    Points,
    Polygon,
    Rect,
    Triangle
} from "../api";
import { dispatch } from "../internal/dispatch";

export const pointInside = defmulti<IShape, ReadonlyVec, boolean>(dispatch);

pointInside.addAll(<IObjectOf<Implementation2<unknown, ReadonlyVec, boolean>>>{
    [Type.AABB]: ($: AABB, p: ReadonlyVec) => pointInAABB(p, $.pos, $.size),

    [Type.CIRCLE]: ($: Circle, p) => pointInCircle(p, $.pos, $.r),

    [Type.LINE]: ($: Line, p) => pointInSegment(p, $.points[0], $.points[1]),

    [Type.POINTS]: ({ points }: Points, p) => isInArray(p, points),

    [Type.POLYGON]: ($: Polygon, p) => pointInPolygon2(p, $.points) > 0,

    [Type.RECT]: ($: Rect, p: ReadonlyVec) => pointInRect(p, $.pos, $.size),

    [Type.TRIANGLE]: (tri: Triangle, p: ReadonlyVec) =>
        pointInTriangle2(p, ...(<[Vec, Vec, Vec]>tri.points))
});

pointInside.isa(Type.SPHERE, Type.CIRCLE);
pointInside.isa(Type.QUAD, Type.POLYGON);
