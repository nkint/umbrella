import {
    Fn3,
    Pair,
    Predicate2,
    SEMAPHORE
} from "@thi.ng/api";
import { equiv } from "@thi.ng/equiv";
import { EquivSetOpts, IEquivSet } from "./api";

interface ArraySetProps<T> {
    vals: T[];
    equiv: Predicate2<T>;
}

const __private = new WeakMap<ArraySet<any>, ArraySetProps<any>>();

/**
 * An alternative set implementation to the native ES6 Set type. Uses
 * customizable equality/equivalence predicate and so is more useful
 * when dealing with structured data. Implements full API of native Set
 * and by the default uses `@thi.ng/equiv` for equivalence checking.
 *
 * Additionally, the type also implements the `ICopy`, `IEmpty` and
 * `IEquiv` interfaces itself.
 */
export class ArraySet<T> extends Set<T> implements IEquivSet<T> {
    constructor(
        vals?: Iterable<T> | null,
        opts: Partial<EquivSetOpts<T>> = {}
    ) {
        super();
        __private.set(this, { equiv: opts.equiv || equiv, vals: [] });
        vals && this.into(vals);
    }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* __private.get(this)!.vals;
    }

    get [Symbol.species]() {
        return ArraySet;
    }

    get [Symbol.toStringTag]() {
        return "ArraySet";
    }

    get size(): number {
        return __private.get(this)!.vals.length;
    }

    copy(): ArraySet<T> {
        const $this = __private.get(this)!;
        const s = new ArraySet<T>(null, { equiv: $this.equiv });
        __private.get(s)!.vals = $this.vals.slice();
        return s;
    }

    empty() {
        return new ArraySet<T>(null, this.opts());
    }

    clear() {
        __private.get(this)!.vals.length = 0;
    }

    first(): T | undefined {
        if (this.size) {
            return __private.get(this)!.vals[0];
        }
    }

    add(x: T) {
        !this.has(x) && __private.get(this)!.vals.push(x);
        return this;
    }

    into(xs: Iterable<T>) {
        for (let x of xs) {
            this.add(x);
        }
        return this;
    }

    has(x: T) {
        return this.get(x, <any>SEMAPHORE) !== <any>SEMAPHORE;
    }

    /**
     * Returns the canonical value for `x`, if present. If the set
     * contains no equivalent for `x`, returns `notFound`.
     *
     * @param x
     * @param notFound
     */
    get(x: T, notFound?: T): T | undefined {
        const $this = __private.get(this)!;
        const eq = $this.equiv;
        const vals = $this.vals;
        for (let i = vals.length - 1; i >= 0; i--) {
            if (eq(vals[i], x)) {
                return vals[i];
            }
        }
        return notFound;
    }

    delete(x: T) {
        const $this = __private.get(this)!;
        const eq = $this.equiv;
        const vals = $this.vals;
        for (let i = vals.length - 1; i >= 0; i--) {
            if (eq(vals[i], x)) {
                vals.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    disj(xs: Iterable<T>) {
        for (let x of xs) {
            this.delete(x);
        }
        return this;
    }

    equiv(o: any) {
        if (this === o) {
            return true;
        }
        if (!(o instanceof Set)) {
            return false;
        }
        if (this.size !== o.size) {
            return false;
        }
        const vals = __private.get(this)!.vals;
        for (let i = vals.length; --i >= 0; ) {
            if (!o.has(vals[i])) {
                return false;
            }
        }
        return true;
    }

    forEach(fn: Fn3<Readonly<T>, Readonly<T>, Set<T>, void>, thisArg?: any) {
        const vals = __private.get(this)!.vals;
        for (let i = vals.length; --i >= 0; ) {
            const v = vals[i];
            fn.call(thisArg, v, v, this);
        }
    }

    *entries(): IterableIterator<Pair<T, T>> {
        for (let v of __private.get(this)!.vals) {
            yield [v, v];
        }
    }

    *keys(): IterableIterator<T> {
        yield* __private.get(this)!.vals;
    }

    *values(): IterableIterator<T> {
        yield* this.keys();
    }

    opts(): EquivSetOpts<T> {
        return { equiv: __private.get(this)!.equiv };
    }
}
