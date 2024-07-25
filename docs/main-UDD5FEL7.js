var e0 = Object.defineProperty,
  t0 = Object.defineProperties;
var n0 = Object.getOwnPropertyDescriptors;
var No = Object.getOwnPropertySymbols;
var Mf = Object.prototype.hasOwnProperty,
  Af = Object.prototype.propertyIsEnumerable;
var Tf = (t, e, n) =>
    e in t
      ? e0(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  C = (t, e) => {
    for (var n in (e ||= {})) Mf.call(e, n) && Tf(t, n, e[n]);
    if (No) for (var n of No(e)) Af.call(e, n) && Tf(t, n, e[n]);
    return t;
  },
  Ee = (t, e) => t0(t, n0(e));
var xf = (t, e) => {
  var n = {};
  for (var r in t) Mf.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && No)
    for (var r of No(t)) e.indexOf(r) < 0 && Af.call(t, r) && (n[r] = t[r]);
  return n;
};
var al = (t, e, n) =>
  new Promise((r, i) => {
    var o = (l) => {
        try {
          a(n.next(l));
        } catch (c) {
          i(c);
        }
      },
      s = (l) => {
        try {
          a(n.throw(l));
        } catch (c) {
          i(c);
        }
      },
      a = (l) => (l.done ? r(l.value) : Promise.resolve(l.value).then(o, s));
    a((n = n.apply(t, e)).next());
  });
function r0(t, e) {
  return Object.is(t, e);
}
var Ae = null,
  Ro = !1,
  Oo = 1,
  Wn = Symbol('SIGNAL');
function te(t) {
  let e = Ae;
  return (Ae = t), e;
}
var ll = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Nf(t) {
  if (Ro) throw new Error('');
  if (Ae === null) return;
  Ae.consumerOnSignalRead(t);
  let e = Ae.nextProducerIndex++;
  if (
    (wr(Ae), e < Ae.producerNode.length && Ae.producerNode[e] !== t && mi(Ae))
  ) {
    let n = Ae.producerNode[e];
    Po(n, Ae.producerIndexOfThis[e]);
  }
  Ae.producerNode[e] !== t &&
    ((Ae.producerNode[e] = t),
    (Ae.producerIndexOfThis[e] = mi(Ae) ? kf(t, Ae, e) : 0)),
    (Ae.producerLastReadVersion[e] = t.version);
}
function i0() {
  Oo++;
}
function o0(t) {
  if (!(mi(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Oo)) {
    if (!t.producerMustRecompute(t) && !cl(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Oo);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Oo);
  }
}
function Rf(t) {
  if (t.liveConsumerNode === void 0) return;
  let e = Ro;
  Ro = !0;
  try {
    for (let n of t.liveConsumerNode) n.dirty || s0(n);
  } finally {
    Ro = e;
  }
}
function Of() {
  return Ae?.consumerAllowSignalWrites !== !1;
}
function s0(t) {
  (t.dirty = !0), Rf(t), t.consumerMarkedDirty?.(t);
}
function Pf(t) {
  return t && (t.nextProducerIndex = 0), te(t);
}
function Ff(t, e) {
  if (
    (te(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (mi(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        Po(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function cl(t) {
  wr(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (o0(n), r !== n.version)) return !0;
  }
  return !1;
}
function Lf(t) {
  if ((wr(t), mi(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Po(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function kf(t, e, n) {
  if ((jf(t), wr(t), t.liveConsumerNode.length === 0))
    for (let r = 0; r < t.producerNode.length; r++)
      t.producerIndexOfThis[r] = kf(t.producerNode[r], t, r);
  return t.liveConsumerIndexOfThis.push(n), t.liveConsumerNode.push(e) - 1;
}
function Po(t, e) {
  if ((jf(t), wr(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      Po(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    wr(i), (i.producerIndexOfThis[r] = e);
  }
}
function mi(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function wr(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function jf(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function a0() {
  throw new Error();
}
var Bf = a0;
function Vf() {
  Bf();
}
function Uf(t) {
  Bf = t;
}
var l0 = null;
function Hf(t) {
  let e = Object.create(zf);
  e.value = t;
  let n = () => (Nf(e), e.value);
  return (n[Wn] = e), n;
}
function ul(t, e) {
  Of() || Vf(), t.equal(t.value, e) || ((t.value = e), c0(t));
}
function $f(t, e) {
  Of() || Vf(), ul(t, e(t.value));
}
var zf = Ee(C({}, ll), { equal: r0, value: void 0 });
function c0(t) {
  t.version++, i0(), Rf(t), l0?.();
}
function F(t) {
  return typeof t == 'function';
}
function Dr(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Fo = Dr(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n);
    },
);
function vi(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var Se = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let o of n) o.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (F(r))
        try {
          r();
        } catch (o) {
          e = o instanceof Fo ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Wf(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Fo ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Fo(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) Wf(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && vi(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && vi(n, e), e instanceof t && e._removeParent(this);
  }
};
Se.EMPTY = (() => {
  let t = new Se();
  return (t.closed = !0), t;
})();
var dl = Se.EMPTY;
function Lo(t) {
  return (
    t instanceof Se ||
    (t && 'closed' in t && F(t.remove) && F(t.add) && F(t.unsubscribe))
  );
}
function Wf(t) {
  F(t) ? t() : t.unsubscribe();
}
var _t = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Er = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = Er;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = Er;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function ko(t) {
  Er.setTimeout(() => {
    let { onUnhandledError: e } = _t;
    if (e) e(t);
    else throw t;
  });
}
function yi() {}
var qf = fl('C', void 0, void 0);
function Gf(t) {
  return fl('E', void 0, t);
}
function Kf(t) {
  return fl('N', t, void 0);
}
function fl(t, e, n) {
  return { kind: t, value: e, error: n };
}
var qn = null;
function Cr(t) {
  if (_t.useDeprecatedSynchronousErrorHandling) {
    let e = !qn;
    if ((e && (qn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = qn;
      if (((qn = null), n)) throw r;
    }
  } else t();
}
function Qf(t) {
  _t.useDeprecatedSynchronousErrorHandling &&
    qn &&
    ((qn.errorThrown = !0), (qn.error = t));
}
var Gn = class extends Se {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Lo(e) && e.add(this))
          : (this.destination = f0);
    }
    static create(e, n, r) {
      return new br(e, n, r);
    }
    next(e) {
      this.isStopped ? hl(Kf(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? hl(Gf(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? hl(qf, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  u0 = Function.prototype.bind;
function pl(t, e) {
  return u0.call(t, e);
}
var gl = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          jo(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          jo(r);
        }
      else jo(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          jo(n);
        }
    }
  },
  br = class extends Gn {
    constructor(e, n, r) {
      super();
      let i;
      if (F(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && _t.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && pl(e.next, o),
              error: e.error && pl(e.error, o),
              complete: e.complete && pl(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new gl(i);
    }
  };
function jo(t) {
  _t.useDeprecatedSynchronousErrorHandling ? Qf(t) : ko(t);
}
function d0(t) {
  throw t;
}
function hl(t, e) {
  let { onStoppedNotification: n } = _t;
  n && Er.setTimeout(() => n(t, e));
}
var f0 = { closed: !0, next: yi, error: d0, complete: yi };
var _r = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function nt(t) {
  return t;
}
function ml(...t) {
  return vl(t);
}
function vl(t) {
  return t.length === 0
    ? nt
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n);
        };
}
var ae = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let o = h0(n) ? n : new br(n, r, i);
      return (
        Cr(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o),
          );
        }),
        o
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Yf(r)),
        new r((i, o) => {
          let s = new br({
            next: (a) => {
              try {
                n(a);
              } catch (l) {
                o(l), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [_r]() {
      return this;
    }
    pipe(...n) {
      return vl(n)(this);
    }
    toPromise(n) {
      return (
        (n = Yf(n)),
        new n((r, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o),
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Yf(t) {
  var e;
  return (e = t ?? _t.Promise) !== null && e !== void 0 ? e : Promise;
}
function p0(t) {
  return t && F(t.next) && F(t.error) && F(t.complete);
}
function h0(t) {
  return (t && t instanceof Gn) || (p0(t) && Lo(t));
}
function yl(t) {
  return F(t?.lift);
}
function Q(t) {
  return (e) => {
    if (yl(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function Y(t, e, n, r, i) {
  return new wl(t, e, n, r, i);
}
var wl = class extends Gn {
  constructor(e, n, r, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (l) {
              e.error(l);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (l) {
              e.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Ir() {
  return Q((t, e) => {
    let n = null;
    t._refCount++;
    let r = Y(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        o = n;
      (n = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var Sr = class extends ae {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      yl(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new Se();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          Y(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown(),
          ),
        ),
      ),
        e.closed && ((this._connection = null), (e = Se.EMPTY));
    }
    return e;
  }
  refCount() {
    return Ir()(this);
  }
};
var Zf = Dr(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed');
    },
);
var xe = (() => {
    class t extends ae {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Bo(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Zf();
      }
      next(n) {
        Cr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Cr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Cr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: o } = this;
        return r || i
          ? dl
          : ((this.currentObservers = null),
            o.push(n),
            new Se(() => {
              (this.currentObservers = null), vi(o, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this;
        r ? n.error(i) : o && n.complete();
      }
      asObservable() {
        let n = new ae();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new Bo(e, n)), t;
  })(),
  Bo = class extends xe {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : dl;
    }
  };
var ke = class extends xe {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var rt = new ae((t) => t.complete());
function Jf(t) {
  return t && F(t.schedule);
}
function Xf(t) {
  return t[t.length - 1];
}
function ep(t) {
  return F(Xf(t)) ? t.pop() : void 0;
}
function wn(t) {
  return Jf(Xf(t)) ? t.pop() : void 0;
}
function np(t, e, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      u.done ? o(u.value) : i(u.value).then(a, l);
    }
    c((r = r.apply(t, e || [])).next());
  });
}
function tp(t) {
  var e = typeof Symbol == 'function' && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
  );
}
function Kn(t) {
  return this instanceof Kn ? ((this.v = t), this) : new Kn(t);
}
function rp(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s('next'),
    s('throw'),
    s('return'),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    r[f] &&
      (i[f] = function (p) {
        return new Promise(function (h, g) {
          o.push([f, p, h, g]) > 1 || a(f, p);
        });
      });
  }
  function a(f, p) {
    try {
      l(r[f](p));
    } catch (h) {
      d(o[0][3], h);
    }
  }
  function l(f) {
    f.value instanceof Kn
      ? Promise.resolve(f.value.v).then(c, u)
      : d(o[0][2], f);
  }
  function c(f) {
    a('next', f);
  }
  function u(f) {
    a('throw', f);
  }
  function d(f, p) {
    f(p), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function ip(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof tp == 'function' ? tp(t) : t[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, l) {
          (s = t[o](s)), i(a, l, s.done, s.value);
        });
      };
  }
  function i(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var Vo = (t) => t && typeof t.length == 'number' && typeof t != 'function';
function Uo(t) {
  return F(t?.then);
}
function Ho(t) {
  return F(t[_r]);
}
function $o(t) {
  return Symbol.asyncIterator && F(t?.[Symbol.asyncIterator]);
}
function zo(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function g0() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator;
}
var Wo = g0();
function qo(t) {
  return F(t?.[Wo]);
}
function Go(t) {
  return rp(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Kn(n.read());
        if (i) return yield Kn(void 0);
        yield yield Kn(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Ko(t) {
  return F(t?.getReader);
}
function Ne(t) {
  if (t instanceof ae) return t;
  if (t != null) {
    if (Ho(t)) return m0(t);
    if (Vo(t)) return v0(t);
    if (Uo(t)) return y0(t);
    if ($o(t)) return op(t);
    if (qo(t)) return w0(t);
    if (Ko(t)) return D0(t);
  }
  throw zo(t);
}
function m0(t) {
  return new ae((e) => {
    let n = t[_r]();
    if (F(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable',
    );
  });
}
function v0(t) {
  return new ae((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function y0(t) {
  return new ae((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n),
    ).then(null, ko);
  });
}
function w0(t) {
  return new ae((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function op(t) {
  return new ae((e) => {
    E0(t, e).catch((n) => e.error(n));
  });
}
function D0(t) {
  return op(Go(t));
}
function E0(t, e) {
  var n, r, i, o;
  return np(this, void 0, void 0, function* () {
    try {
      for (n = ip(t); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function We(t, e, n, r = 0, i = !1) {
  let o = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(o), !i)) return o;
}
function Qo(t, e = 0) {
  return Q((n, r) => {
    n.subscribe(
      Y(
        r,
        (i) => We(r, t, () => r.next(i), e),
        () => We(r, t, () => r.complete(), e),
        (i) => We(r, t, () => r.error(i), e),
      ),
    );
  });
}
function Yo(t, e = 0) {
  return Q((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function sp(t, e) {
  return Ne(t).pipe(Yo(e), Qo(e));
}
function ap(t, e) {
  return Ne(t).pipe(Yo(e), Qo(e));
}
function lp(t, e) {
  return new ae((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function cp(t, e) {
  return new ae((n) => {
    let r;
    return (
      We(n, e, () => {
        (r = t[Wo]()),
          We(
            n,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              o ? n.complete() : n.next(i);
            },
            0,
            !0,
          );
      }),
      () => F(r?.return) && r.return()
    );
  });
}
function Zo(t, e) {
  if (!t) throw new Error('Iterable cannot be null');
  return new ae((n) => {
    We(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      We(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function up(t, e) {
  return Zo(Go(t), e);
}
function dp(t, e) {
  if (t != null) {
    if (Ho(t)) return sp(t, e);
    if (Vo(t)) return lp(t, e);
    if (Uo(t)) return ap(t, e);
    if ($o(t)) return Zo(t, e);
    if (qo(t)) return cp(t, e);
    if (Ko(t)) return up(t, e);
  }
  throw zo(t);
}
function ve(t, e) {
  return e ? dp(t, e) : Ne(t);
}
function R(...t) {
  let e = wn(t);
  return ve(t, e);
}
function Tr(t, e) {
  let n = F(t) ? t : () => t,
    r = (i) => i.error(n());
  return new ae(e ? (i) => e.schedule(r, 0, i) : r);
}
function Dl(t) {
  return !!t && (t instanceof ae || (F(t.lift) && F(t.subscribe)));
}
var tn = Dr(
  (t) =>
    function () {
      t(this),
        (this.name = 'EmptyError'),
        (this.message = 'no elements in sequence');
    },
);
function Z(t, e) {
  return Q((n, r) => {
    let i = 0;
    n.subscribe(
      Y(r, (o) => {
        r.next(t.call(e, o, i++));
      }),
    );
  });
}
var { isArray: C0 } = Array;
function b0(t, e) {
  return C0(e) ? t(...e) : t(e);
}
function fp(t) {
  return Z((e) => b0(t, e));
}
var { isArray: _0 } = Array,
  { getPrototypeOf: I0, prototype: S0, keys: T0 } = Object;
function pp(t) {
  if (t.length === 1) {
    let e = t[0];
    if (_0(e)) return { args: e, keys: null };
    if (M0(e)) {
      let n = T0(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function M0(t) {
  return t && typeof t == 'object' && I0(t) === S0;
}
function hp(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function wi(...t) {
  let e = wn(t),
    n = ep(t),
    { args: r, keys: i } = pp(t);
  if (r.length === 0) return ve([], e);
  let o = new ae(A0(r, e, i ? (s) => hp(i, s) : nt));
  return n ? o.pipe(fp(n)) : o;
}
function A0(t, e, n = nt) {
  return (r) => {
    gp(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let l = 0; l < i; l++)
          gp(
            e,
            () => {
              let c = ve(t[l], e),
                u = !1;
              c.subscribe(
                Y(
                  r,
                  (d) => {
                    (o[l] = d), u || ((u = !0), a--), a || r.next(n(o.slice()));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function gp(t, e, n) {
  t ? We(n, t, e) : e();
}
function mp(t, e, n, r, i, o, s, a) {
  let l = [],
    c = 0,
    u = 0,
    d = !1,
    f = () => {
      d && !l.length && !c && e.complete();
    },
    p = (g) => (c < r ? h(g) : l.push(g)),
    h = (g) => {
      o && e.next(g), c++;
      let M = !1;
      Ne(n(g, u++)).subscribe(
        Y(
          e,
          (A) => {
            i?.(A), o ? p(A) : e.next(A);
          },
          () => {
            M = !0;
          },
          void 0,
          () => {
            if (M)
              try {
                for (c--; l.length && c < r; ) {
                  let A = l.shift();
                  s ? We(e, s, () => h(A)) : h(A);
                }
                f();
              } catch (A) {
                e.error(A);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      Y(e, p, () => {
        (d = !0), f();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function be(t, e, n = 1 / 0) {
  return F(e)
    ? be((r, i) => Z((o, s) => e(r, o, i, s))(Ne(t(r, i))), n)
    : (typeof e == 'number' && (n = e), Q((r, i) => mp(r, i, t, n)));
}
function Dn(t = 1 / 0) {
  return be(nt, t);
}
function vp() {
  return Dn(1);
}
function Mr(...t) {
  return vp()(ve(t, wn(t)));
}
function Jo(t) {
  return new ae((e) => {
    Ne(t()).subscribe(e);
  });
}
function gt(t, e) {
  return Q((n, r) => {
    let i = 0;
    n.subscribe(Y(r, (o) => t.call(e, o, i++) && r.next(o)));
  });
}
function En(t) {
  return Q((e, n) => {
    let r = null,
      i = !1,
      o;
    (r = e.subscribe(
      Y(n, void 0, void 0, (s) => {
        (o = Ne(t(s, En(t)(e)))),
          r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
      }),
    )),
      i && (r.unsubscribe(), (r = null), o.subscribe(n));
  });
}
function yp(t, e, n, r, i) {
  return (o, s) => {
    let a = n,
      l = e,
      c = 0;
    o.subscribe(
      Y(
        s,
        (u) => {
          let d = c++;
          (l = a ? t(l, u, d) : ((a = !0), u)), r && s.next(l);
        },
        i &&
          (() => {
            a && s.next(l), s.complete();
          }),
      ),
    );
  };
}
function Qn(t, e) {
  return F(e) ? be(t, e, 1) : be(t, 1);
}
function Cn(t) {
  return Q((e, n) => {
    let r = !1;
    e.subscribe(
      Y(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(t), n.complete();
        },
      ),
    );
  });
}
function nn(t) {
  return t <= 0
    ? () => rt
    : Q((e, n) => {
        let r = 0;
        e.subscribe(
          Y(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          }),
        );
      });
}
function El(t) {
  return Z(() => t);
}
function Xo(t = x0) {
  return Q((e, n) => {
    let r = !1;
    e.subscribe(
      Y(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t())),
      ),
    );
  });
}
function x0() {
  return new tn();
}
function Di(t) {
  return Q((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Lt(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? gt((i, o) => t(i, o, r)) : nt,
      nn(1),
      n ? Cn(e) : Xo(() => new tn()),
    );
}
function Ar(t) {
  return t <= 0
    ? () => rt
    : Q((e, n) => {
        let r = [];
        e.subscribe(
          Y(
            n,
            (i) => {
              r.push(i), t < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Cl(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? gt((i, o) => t(i, o, r)) : nt,
      Ar(1),
      n ? Cn(e) : Xo(() => new tn()),
    );
}
function bl(t, e) {
  return Q(yp(t, e, arguments.length >= 2, !0));
}
function _l(...t) {
  let e = wn(t);
  return Q((n, r) => {
    (e ? Mr(t, n, e) : Mr(t, n)).subscribe(r);
  });
}
function mt(t, e) {
  return Q((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      Y(
        r,
        (l) => {
          i?.unsubscribe();
          let c = 0,
            u = o++;
          Ne(t(l, u)).subscribe(
            (i = Y(
              r,
              (d) => r.next(e ? e(l, d, u, c++) : d),
              () => {
                (i = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function Il(t) {
  return Q((e, n) => {
    Ne(t).subscribe(Y(n, () => n.complete(), yi)), !n.closed && e.subscribe(n);
  });
}
function je(t, e, n) {
  let r = F(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? Q((i, o) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        i.subscribe(
          Y(
            o,
            (l) => {
              var c;
              (c = r.next) === null || c === void 0 || c.call(r, l), o.next(l);
            },
            () => {
              var l;
              (a = !1),
                (l = r.complete) === null || l === void 0 || l.call(r),
                o.complete();
            },
            (l) => {
              var c;
              (a = !1),
                (c = r.error) === null || c === void 0 || c.call(r, l),
                o.error(l);
            },
            () => {
              var l, c;
              a && ((l = r.unsubscribe) === null || l === void 0 || l.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r);
            },
          ),
        );
      })
    : nt;
}
var nh = 'https://g.co/ng/security#xss',
  v = class extends Error {
    constructor(e, n) {
      super(Lc(e, n)), (this.code = e);
    }
  };
function Lc(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`;
}
function Oi(t) {
  return { toString: t }.toString();
}
var es = '__parameters__';
function N0(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function rh(t, e, n) {
  return Oi(() => {
    let r = N0(e);
    function i(...o) {
      if (this instanceof i) return r.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(l, c, u) {
        let d = l.hasOwnProperty(es)
          ? l[es]
          : Object.defineProperty(l, es, { value: [] })[es];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), l;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var Re = globalThis;
function ce(t) {
  for (let e in t) if (t[e] === ce) return e;
  throw Error('Could not find renamed property on target object.');
}
function R0(t, e) {
  for (let n in e) e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
}
function Ke(t) {
  if (typeof t == 'string') return t;
  if (Array.isArray(t)) return '[' + t.map(Ke).join(', ') + ']';
  if (t == null) return '' + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return '' + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function Vl(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
      ? t
      : t + ' ' + e;
}
var O0 = ce({ __forward_ref__: ce });
function ih(t) {
  return (
    (t.__forward_ref__ = ih),
    (t.toString = function () {
      return Ke(this());
    }),
    t
  );
}
function vt(t) {
  return oh(t) ? t() : t;
}
function oh(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(O0) && t.__forward_ref__ === ih
  );
}
function I(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function _e(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function As(t) {
  return wp(t, ah) || wp(t, lh);
}
function sh(t) {
  return As(t) !== null;
}
function wp(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function P0(t) {
  let e = t && (t[ah] || t[lh]);
  return e || null;
}
function Dp(t) {
  return t && (t.hasOwnProperty(Ep) || t.hasOwnProperty(F0)) ? t[Ep] : null;
}
var ah = ce({ ɵprov: ce }),
  Ep = ce({ ɵinj: ce }),
  lh = ce({ ngInjectableDef: ce }),
  F0 = ce({ ngInjectorDef: ce }),
  V = class {
    constructor(e, n) {
      (this._desc = e),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = I({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function ch(t) {
  return t && !!t.ɵproviders;
}
var L0 = ce({ ɵcmp: ce }),
  k0 = ce({ ɵdir: ce }),
  j0 = ce({ ɵpipe: ce }),
  B0 = ce({ ɵmod: ce }),
  us = ce({ ɵfac: ce }),
  Ei = ce({ __NG_ELEMENT_ID__: ce }),
  Cp = ce({ __NG_ENV_ID__: ce });
function xs(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t);
}
function V0(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : xs(t);
}
function U0(t, e) {
  let n = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : '';
  throw new v(-200, t);
}
function kc(t, e) {
  throw new v(-201, !1);
}
var G = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    );
  })(G || {}),
  Ul;
function uh() {
  return Ul;
}
function qe(t) {
  let e = Ul;
  return (Ul = t), e;
}
function dh(t, e, n) {
  let r = As(t);
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & G.Optional) return null;
  if (e !== void 0) return e;
  kc(t, 'Injector');
}
var H0 = {},
  Ci = H0,
  Hl = '__NG_DI_FLAG__',
  ds = 'ngTempTokenPath',
  $0 = 'ngTokenPath',
  z0 = /\n/gm,
  W0 = '\u0275',
  bp = '__source',
  Pr;
function q0() {
  return Pr;
}
function bn(t) {
  let e = Pr;
  return (Pr = t), e;
}
function G0(t, e = G.Default) {
  if (Pr === void 0) throw new v(-203, !1);
  return Pr === null
    ? dh(t, void 0, e)
    : Pr.get(t, e & G.Optional ? null : void 0, e);
}
function x(t, e = G.Default) {
  return (uh() || G0)(vt(t), e);
}
function D(t, e = G.Default) {
  return x(t, Ns(e));
}
function Ns(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function $l(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = vt(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new v(900, !1);
      let i,
        o = G.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          l = K0(a);
        typeof l == 'number' ? (l === -1 ? (i = a.token) : (o |= l)) : (i = a);
      }
      e.push(x(i, o));
    } else e.push(x(r));
  }
  return e;
}
function fh(t, e) {
  return (t[Hl] = e), (t.prototype[Hl] = e), t;
}
function K0(t) {
  return t[Hl];
}
function Q0(t, e, n, r) {
  let i = t[ds];
  throw (
    (e[bp] && i.unshift(e[bp]),
    (t.message = Y0(
      `
` + t.message,
      i,
      n,
      r,
    )),
    (t[$0] = i),
    (t[ds] = null),
    t)
  );
}
function Y0(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == W0
      ? t.slice(2)
      : t;
  let i = Ke(e);
  if (Array.isArray(e)) i = e.map(Ke).join(' -> ');
  else if (typeof e == 'object') {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : Ke(a)));
      }
    i = `{${o.join(', ')}}`;
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${t.replace(
    z0,
    `
  `,
  )}`;
}
var Pi = fh(rh('Optional'), 8);
var Rs = fh(rh('SkipSelf'), 4);
function Xn(t, e) {
  let n = t.hasOwnProperty(us);
  return n ? t[us] : null;
}
function Z0(t, e, n) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; r++) {
    let i = t[r],
      o = e[r];
    if ((n && ((i = n(i)), (o = n(o))), o !== i)) return !1;
  }
  return !0;
}
function J0(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function jc(t, e) {
  t.forEach((n) => (Array.isArray(n) ? jc(n, e) : e(n)));
}
function ph(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function fs(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function X0(t, e) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(e);
  return n;
}
function ew(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function Bc(t, e, n) {
  let r = Fi(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), ew(t, r, e, n)), r;
}
function Sl(t, e) {
  let n = Fi(t, e);
  if (n >= 0) return t[n | 1];
}
function Fi(t, e) {
  return tw(t, e, 1);
}
function tw(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = t[o << n];
    if (e === s) return o << n;
    s > e ? (i = o) : (r = o + 1);
  }
  return ~(i << n);
}
var Lr = {},
  Ge = [],
  kr = new V(''),
  hh = new V('', -1),
  gh = new V(''),
  ps = class {
    get(e, n = Ci) {
      if (n === Ci) {
        let r = new Error(`NullInjectorError: No provider for ${Ke(e)}!`);
        throw ((r.name = 'NullInjectorError'), r);
      }
      return n;
    }
  },
  mh = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t;
  })(mh || {}),
  Bt = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    );
  })(Bt || {}),
  j = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    );
  })(j || {});
function nw(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === r || t.charCodeAt(i + o) <= 32) return i;
    }
    n = i + 1;
  }
}
function zl(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == 'number') {
      if (i !== 0) break;
      r++;
      let o = n[r++],
        s = n[r++],
        a = n[r++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = n[++r];
      rw(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
    }
  }
  return r;
}
function vh(t) {
  return t === 3 || t === 4 || t === 6;
}
function rw(t) {
  return t.charCodeAt(0) === 64;
}
function bi(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == 'number'
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? _p(t, n, i, null, e[++r])
              : _p(t, n, i, null, null));
      }
    }
  return t;
}
function _p(t, e, n, r, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == 'number') {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == 'number') break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (r === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, r !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, n),
    r !== null && t.splice(o++, 0, r),
    i !== null && t.splice(o++, 0, i);
}
var yh = 'ng-template';
function iw(t, e, n, r) {
  let i = 0;
  if (r) {
    for (; i < e.length && typeof e[i] == 'string'; i += 2)
      if (e[i] === 'class' && nw(e[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Vc(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == 'string'; )
      if (o.toLowerCase() === n) return !0;
  }
  return !1;
}
function Vc(t) {
  return t.type === 4 && t.value !== yh;
}
function ow(t, e, n) {
  let r = t.type === 4 && !n ? yh : t.value;
  return e === r;
}
function sw(t, e, n) {
  let r = 4,
    i = t.attrs,
    o = i !== null ? cw(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let l = e[a];
    if (typeof l == 'number') {
      if (!s && !It(r) && !It(l)) return !1;
      if (s && It(l)) continue;
      (s = !1), (r = l | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (l !== '' && !ow(t, l, n)) || (l === '' && e.length === 1))
        ) {
          if (It(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (i === null || !iw(t, i, l, n)) {
          if (It(r)) return !1;
          s = !0;
        }
      } else {
        let c = e[++a],
          u = aw(l, i, Vc(t), n);
        if (u === -1) {
          if (It(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let d;
          if (
            (u > o ? (d = '') : (d = i[u + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (It(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return It(r) || s;
}
function It(t) {
  return (t & 1) === 0;
}
function aw(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == 'string'; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return uw(e, t);
}
function wh(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (sw(t, e[r], n)) return !0;
  return !1;
}
function lw(t) {
  let e = t.attrs;
  if (e != null) {
    let n = e.indexOf(5);
    if (!(n & 1)) return e[n + 1];
  }
  return null;
}
function cw(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (vh(n)) return e;
  }
  return t.length;
}
function uw(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == 'number') return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function dw(t, e) {
  e: for (let n = 0; n < e.length; n++) {
    let r = e[n];
    if (t.length === r.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== r[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Ip(t, e) {
  return t ? ':not(' + e.trim() + ')' : e;
}
function fw(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = '',
    o = !1;
  for (; n < t.length; ) {
    let s = t[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = t[++n];
        i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (i += '.' + s) : r & 4 && (i += ' ' + s);
    else
      i !== '' && !It(s) && ((e += Ip(o, i)), (i = '')),
        (r = s),
        (o = o || !It(r));
    n++;
  }
  return i !== '' && (e += Ip(o, i)), e;
}
function pw(t) {
  return t.map(fw).join(',');
}
function hw(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == 'string')
      i === 2 ? o !== '' && e.push(o, t[++r]) : i === 8 && n.push(o);
    else {
      if (!It(i)) break;
      i = o;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function L(t) {
  return Oi(() => {
    let e = _h(t),
      n = Ee(C({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === mh.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Bt.Emulated,
        styles: t.styles || Ge,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      });
    Ih(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = Tp(r, !1)), (n.pipeDefs = Tp(r, !0)), (n.id = vw(n)), n
    );
  });
}
function gw(t) {
  return In(t) || Dh(t);
}
function mw(t) {
  return t !== null;
}
function Ie(t) {
  return Oi(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Ge,
    declarations: t.declarations || Ge,
    imports: t.imports || Ge,
    exports: t.exports || Ge,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Sp(t, e) {
  if (t == null) return Lr;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        o,
        s,
        a = j.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((n[o] = a !== j.None ? [r, a] : r), (e[o] = s)) : (n[o] = r);
    }
  return n;
}
function Oe(t) {
  return Oi(() => {
    let e = _h(t);
    return Ih(e), e;
  });
}
function Os(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function In(t) {
  return t[L0] || null;
}
function Dh(t) {
  return t[k0] || null;
}
function Eh(t) {
  return t[j0] || null;
}
function Ch(t) {
  let e = In(t) || Dh(t) || Eh(t);
  return e !== null ? e.standalone : !1;
}
function bh(t, e) {
  let n = t[B0] || null;
  if (!n && e === !0)
    throw new Error(`Type ${Ke(t)} does not have '\u0275mod' property.`);
  return n;
}
function _h(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Lr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Ge,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Sp(t.inputs, e),
    outputs: Sp(t.outputs),
    debugInfo: null,
  };
}
function Ih(t) {
  t.features?.forEach((e) => e(t));
}
function Tp(t, e) {
  if (!t) return null;
  let n = e ? Eh : gw;
  return () => (typeof t == 'function' ? t() : t).map((r) => n(r)).filter(mw);
}
function vw(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join('|');
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), 'c' + e;
}
function Ps(t) {
  return { ɵproviders: t };
}
function Uc(...t) {
  return { ɵproviders: Sh(!0, t), ɵfromNgModule: !0 };
}
function Sh(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    jc(e, (s) => {
      let a = s;
      Wl(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Th(i, o),
    n
  );
}
function Th(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    Hc(i, (o) => {
      e(o, r);
    });
  }
}
function Wl(t, e, n, r) {
  if (((t = vt(t)), !t)) return !1;
  let i = null,
    o = Dp(t),
    s = !o && In(t);
  if (!o && !s) {
    let l = t.ngModule;
    if (((o = Dp(l)), o)) i = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (s) {
    if (a) return !1;
    if ((r.add(i), s.dependencies)) {
      let l =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of l) Wl(c, e, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let c;
      try {
        jc(o.imports, (u) => {
          Wl(u, e, n, r) && ((c ||= []), c.push(u));
        });
      } finally {
      }
      c !== void 0 && Th(c, e);
    }
    if (!a) {
      let c = Xn(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: Ge }, i),
        e({ provide: gh, useValue: i, multi: !0 }, i),
        e({ provide: kr, useValue: () => x(i), multi: !0 }, i);
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = t;
      Hc(l, (u) => {
        e(u, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Hc(t, e) {
  for (let n of t)
    ch(n) && (n = n.ɵproviders), Array.isArray(n) ? Hc(n, e) : e(n);
}
var yw = ce({ provide: String, useValue: ce });
function Mh(t) {
  return t !== null && typeof t == 'object' && yw in t;
}
function ww(t) {
  return !!(t && t.useExisting);
}
function Dw(t) {
  return !!(t && t.useFactory);
}
function ql(t) {
  return typeof t == 'function';
}
var Fs = new V(''),
  is = {},
  Ew = {},
  Tl;
function $c() {
  return Tl === void 0 && (Tl = new ps()), Tl;
}
var Qe = class {},
  _i = class extends Qe {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Kl(e, (s) => this.processProvider(s)),
        this.records.set(hh, xr(void 0, this)),
        i.has('environment') && this.records.set(Qe, xr(void 0, this));
      let o = this.records.get(Fs);
      o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(gh, Ge, G.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = te(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          te(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = bn(this),
        r = qe(void 0),
        i;
      try {
        return e();
      } finally {
        bn(n), qe(r);
      }
    }
    get(e, n = Ci, r = G.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Cp))) return e[Cp](this);
      r = Ns(r);
      let i,
        o = bn(this),
        s = qe(void 0);
      try {
        if (!(r & G.SkipSelf)) {
          let l = this.records.get(e);
          if (l === void 0) {
            let c = Tw(e) && As(e);
            c && this.injectableDefInScope(c)
              ? (l = xr(Gl(e), is))
              : (l = null),
              this.records.set(e, l);
          }
          if (l != null) return this.hydrate(e, l);
        }
        let a = r & G.Self ? $c() : this.parent;
        return (n = r & G.Optional && n === Ci ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[ds] = a[ds] || []).unshift(Ke(e)), o)) throw a;
          return Q0(a, e, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        qe(s), bn(o);
      }
    }
    resolveInjectorInitializers() {
      let e = te(null),
        n = bn(this),
        r = qe(void 0),
        i;
      try {
        let o = this.get(kr, Ge, G.Self);
        for (let s of o) s();
      } finally {
        bn(n), qe(r), te(e);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(Ke(r));
      return `R3Injector[${e.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1);
    }
    processProvider(e) {
      e = vt(e);
      let n = ql(e) ? e : vt(e && e.provide),
        r = bw(e);
      if (!ql(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = xr(void 0, is, !0)),
          (i.factory = () => $l(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      let r = te(null);
      try {
        return (
          n.value === is && ((n.value = Ew), (n.value = n.factory())),
          typeof n.value == 'object' &&
            n.value &&
            Sw(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        te(r);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = vt(e.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Gl(t) {
  let e = As(t),
    n = e !== null ? e.factory : Xn(t);
  if (n !== null) return n;
  if (t instanceof V) throw new v(204, !1);
  if (t instanceof Function) return Cw(t);
  throw new v(204, !1);
}
function Cw(t) {
  if (t.length > 0) throw new v(204, !1);
  let n = P0(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function bw(t) {
  if (Mh(t)) return xr(void 0, t.useValue);
  {
    let e = _w(t);
    return xr(e, is);
  }
}
function _w(t, e, n) {
  let r;
  if (ql(t)) {
    let i = vt(t);
    return Xn(i) || Gl(i);
  } else if (Mh(t)) r = () => vt(t.useValue);
  else if (Dw(t)) r = () => t.useFactory(...$l(t.deps || []));
  else if (ww(t)) r = () => x(vt(t.useExisting));
  else {
    let i = vt(t && (t.useClass || t.provide));
    if (Iw(t)) r = () => new i(...$l(t.deps));
    else return Xn(i) || Gl(i);
  }
  return r;
}
function xr(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function Iw(t) {
  return !!t.deps;
}
function Sw(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  );
}
function Tw(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof V);
}
function Kl(t, e) {
  for (let n of t)
    Array.isArray(n) ? Kl(n, e) : n && ch(n) ? Kl(n.ɵproviders, e) : e(n);
}
function sn(t, e) {
  t instanceof _i && t.assertNotDestroyed();
  let n,
    r = bn(t),
    i = qe(void 0);
  try {
    return e();
  } finally {
    bn(r), qe(i);
  }
}
function Ah() {
  return uh() !== void 0 || q0() != null;
}
function Mw(t) {
  if (!Ah()) throw new v(-203, !1);
}
function Aw(t) {
  return typeof t == 'function';
}
var an = 0,
  z = 1,
  O = 2,
  Be = 3,
  Tt = 4,
  ot = 5,
  Ii = 6,
  Si = 7,
  Mt = 8,
  jr = 9,
  At = 10,
  ye = 11,
  Ti = 12,
  Mp = 13,
  Wr = 14,
  xt = 15,
  Li = 16,
  Nr = 17,
  rn = 18,
  Ls = 19,
  xh = 20,
  _n = 21,
  Ml = 22,
  er = 23,
  Ye = 25,
  Nh = 1;
var tr = 7,
  hs = 8,
  Br = 9,
  it = 10,
  zc = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    );
  })(zc || {});
function Zn(t) {
  return Array.isArray(t) && typeof t[Nh] == 'object';
}
function ln(t) {
  return Array.isArray(t) && t[Nh] === !0;
}
function Wc(t) {
  return (t.flags & 4) !== 0;
}
function ks(t) {
  return t.componentOffset > -1;
}
function js(t) {
  return (t.flags & 1) === 1;
}
function nr(t) {
  return !!t.template;
}
function xw(t) {
  return (t[O] & 512) !== 0;
}
var Ql = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Rh(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function ar() {
  return Oh;
}
function Oh(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = Rw), Nw;
}
ar.ngInherit = !0;
function Nw() {
  let t = Fh(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === Lr) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function Rw(t, e, n, r, i) {
  let o = this.declaredInputs[r],
    s = Fh(t) || Ow(t, { previous: Lr, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  (a[o] = new Ql(c && c.currentValue, n, l === Lr)), Rh(t, e, i, n);
}
var Ph = '__ngSimpleChanges__';
function Fh(t) {
  return t[Ph] || null;
}
function Ow(t, e) {
  return (t[Ph] = e);
}
var Ap = null;
var kt = function (t, e, n) {
    Ap?.(t, e, n);
  },
  Lh = 'svg',
  Pw = 'math',
  Fw = !1;
function Lw() {
  return Fw;
}
function Vt(t) {
  for (; Array.isArray(t); ) t = t[an];
  return t;
}
function kh(t, e) {
  return Vt(e[t]);
}
function yt(t, e) {
  return Vt(e[t.index]);
}
function jh(t, e) {
  return t.data[e];
}
function qc(t, e) {
  return t[e];
}
function An(t, e) {
  let n = e[t];
  return Zn(n) ? n : n[an];
}
function kw(t) {
  return (t[O] & 4) === 4;
}
function Gc(t) {
  return (t[O] & 128) === 128;
}
function jw(t) {
  return ln(t[Be]);
}
function Vr(t, e) {
  return e == null ? null : t[e];
}
function Bh(t) {
  t[Nr] = 0;
}
function Bw(t) {
  t[O] & 1024 || ((t[O] |= 1024), Gc(t) && Mi(t));
}
function Vw(t, e) {
  for (; t > 0; ) (e = e[Wr]), t--;
  return e;
}
function Kc(t) {
  return !!(t[O] & 9216 || t[er]?.dirty);
}
function Yl(t) {
  t[At].changeDetectionScheduler?.notify(1),
    Kc(t)
      ? Mi(t)
      : t[O] & 64 &&
        (Lw()
          ? ((t[O] |= 1024), Mi(t))
          : t[At].changeDetectionScheduler?.notify());
}
function Mi(t) {
  t[At].changeDetectionScheduler?.notify();
  let e = Ai(t);
  for (; e !== null && !(e[O] & 8192 || ((e[O] |= 8192), !Gc(e))); ) e = Ai(e);
}
function Vh(t, e) {
  if ((t[O] & 256) === 256) throw new v(911, !1);
  t[_n] === null && (t[_n] = []), t[_n].push(e);
}
function Uw(t, e) {
  if (t[_n] === null) return;
  let n = t[_n].indexOf(e);
  n !== -1 && t[_n].splice(n, 1);
}
function Ai(t) {
  let e = t[Be];
  return ln(e) ? e[Be] : e;
}
var U = { lFrame: Gh(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Hw() {
  return U.lFrame.elementDepthCount;
}
function $w() {
  U.lFrame.elementDepthCount++;
}
function zw() {
  U.lFrame.elementDepthCount--;
}
function Uh() {
  return U.bindingsEnabled;
}
function Hh() {
  return U.skipHydrationRootTNode !== null;
}
function Ww(t) {
  return U.skipHydrationRootTNode === t;
}
function qw() {
  U.skipHydrationRootTNode = null;
}
function K() {
  return U.lFrame.lView;
}
function Pe() {
  return U.lFrame.tView;
}
function qr(t) {
  return (U.lFrame.contextLView = t), t[Mt];
}
function Gr(t) {
  return (U.lFrame.contextLView = null), t;
}
function ze() {
  let t = $h();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function $h() {
  return U.lFrame.currentTNode;
}
function Gw() {
  let t = U.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function lr(t, e) {
  let n = U.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function Qc() {
  return U.lFrame.isParent;
}
function Yc() {
  U.lFrame.isParent = !1;
}
function Kw() {
  return U.lFrame.contextLView;
}
function ki() {
  let t = U.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function Qw(t) {
  return (U.lFrame.bindingIndex = t);
}
function Bs() {
  return U.lFrame.bindingIndex++;
}
function Yw(t) {
  let e = U.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function Zw() {
  return U.lFrame.inI18n;
}
function Jw(t, e) {
  let n = U.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), Zl(e);
}
function Xw() {
  return U.lFrame.currentDirectiveIndex;
}
function Zl(t) {
  U.lFrame.currentDirectiveIndex = t;
}
function eD(t) {
  let e = U.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function zh() {
  return U.lFrame.currentQueryIndex;
}
function Zc(t) {
  U.lFrame.currentQueryIndex = t;
}
function tD(t) {
  let e = t[z];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[ot] : null;
}
function Wh(t, e, n) {
  if (n & G.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(n & G.Host); )
      if (((i = tD(o)), i === null || ((o = o[Wr]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let r = (U.lFrame = qh());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Jc(t) {
  let e = qh(),
    n = t[z];
  (U.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function qh() {
  let t = U.lFrame,
    e = t === null ? null : t.child;
  return e === null ? Gh(t) : e;
}
function Gh(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Kh() {
  let t = U.lFrame;
  return (U.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Qh = Kh;
function Xc() {
  let t = Kh();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function nD(t) {
  return (U.lFrame.contextLView = Vw(t, U.lFrame.contextLView))[Mt];
}
function Kr() {
  return U.lFrame.selectedIndex;
}
function rr(t) {
  U.lFrame.selectedIndex = t;
}
function Vs() {
  let t = U.lFrame;
  return jh(t.tView, t.selectedIndex);
}
function xn() {
  U.lFrame.currentNamespace = Lh;
}
function Yh() {
  rD();
}
function rD() {
  U.lFrame.currentNamespace = null;
}
function iD() {
  return U.lFrame.currentNamespace;
}
var Zh = !0;
function Us() {
  return Zh;
}
function Hs(t) {
  Zh = t;
}
function oD(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (r) {
    let s = Oh(e);
    (n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o));
}
function $s(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let o = t.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: u,
      } = o;
    s && (t.contentHooks ??= []).push(-n, s),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      l && (t.viewHooks ??= []).push(-n, l),
      c &&
        ((t.viewHooks ??= []).push(n, c), (t.viewCheckHooks ??= []).push(n, c)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function os(t, e, n) {
  Jh(t, e, 3, n);
}
function ss(t, e, n, r) {
  (t[O] & 3) === n && Jh(t, e, n, r);
}
function Al(t, e) {
  let n = t[O];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[O] = n));
}
function Jh(t, e, n, r) {
  let i = r !== void 0 ? t[Nr] & 65535 : 0,
    o = r ?? -1,
    s = e.length - 1,
    a = 0;
  for (let l = i; l < s; l++)
    if (typeof e[l + 1] == 'number') {
      if (((a = e[l]), r != null && a >= r)) break;
    } else
      e[l] < 0 && (t[Nr] += 65536),
        (a < o || o == -1) &&
          (sD(t, n, e, l), (t[Nr] = (t[Nr] & 4294901760) + l + 2)),
        l++;
}
function xp(t, e) {
  kt(4, t, e);
  let n = te(null);
  try {
    e.call(t);
  } finally {
    te(n), kt(5, t, e);
  }
}
function sD(t, e, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = t[s];
  i
    ? t[O] >> 14 < t[Nr] >> 16 &&
      (t[O] & 3) === e &&
      ((t[O] += 16384), xp(a, o))
    : xp(a, o);
}
var Fr = -1,
  xi = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function aD(t) {
  return t instanceof xi;
}
function lD(t) {
  return (t.flags & 8) !== 0;
}
function cD(t) {
  return (t.flags & 16) !== 0;
}
function Xh(t) {
  return t !== Fr;
}
function gs(t) {
  return t & 32767;
}
function uD(t) {
  return t >> 16;
}
function ms(t, e) {
  let n = uD(t),
    r = e;
  for (; n > 0; ) (r = r[Wr]), n--;
  return r;
}
var Jl = !0;
function vs(t) {
  let e = Jl;
  return (Jl = t), e;
}
var dD = 256,
  eg = dD - 1,
  tg = 5,
  fD = 0,
  jt = {};
function pD(t, e, n) {
  let r;
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Ei) && (r = n[Ei]),
    r == null && (r = n[Ei] = fD++);
  let i = r & eg,
    o = 1 << i;
  e.data[t + (i >> tg)] |= o;
}
function ng(t, e) {
  let n = rg(t, e);
  if (n !== -1) return n;
  let r = e[z];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    xl(r.data, t),
    xl(e, null),
    xl(r.blueprint, null));
  let i = eu(t, e),
    o = t.injectorIndex;
  if (Xh(i)) {
    let s = gs(i),
      a = ms(i, e),
      l = a[z].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | l[s + c];
  }
  return (e[o + 8] = i), o;
}
function xl(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function rg(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function eu(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = lg(i)), r === null)) return Fr;
    if ((n++, (i = i[Wr]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Fr;
}
function hD(t, e, n) {
  pD(t, e, n);
}
function gD(t, e) {
  if (e === 'class') return t.classes;
  if (e === 'style') return t.styles;
  let n = t.attrs;
  if (n) {
    let r = n.length,
      i = 0;
    for (; i < r; ) {
      let o = n[i];
      if (vh(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == 'number')
        for (i++; i < r && typeof n[i] == 'string'; ) i++;
      else {
        if (o === e) return n[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function ig(t, e, n) {
  if (n & G.Optional || t !== void 0) return t;
  kc(e, 'NodeInjector');
}
function og(t, e, n, r) {
  if (
    (n & G.Optional && r === void 0 && (r = null), !(n & (G.Self | G.Host)))
  ) {
    let i = t[jr],
      o = qe(void 0);
    try {
      return i ? i.get(e, r, n & G.Optional) : dh(e, r, n & G.Optional);
    } finally {
      qe(o);
    }
  }
  return ig(r, e, n);
}
function sg(t, e, n, r = G.Default, i) {
  if (t !== null) {
    if (e[O] & 2048 && !(r & G.Self)) {
      let s = wD(t, e, n, r, jt);
      if (s !== jt) return s;
    }
    let o = ag(t, e, n, r, jt);
    if (o !== jt) return o;
  }
  return og(e, n, r, i);
}
function ag(t, e, n, r, i) {
  let o = vD(n);
  if (typeof o == 'function') {
    if (!Wh(e, t, r)) return r & G.Host ? ig(i, n, r) : og(e, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & G.Optional))) kc(n);
      else return s;
    } finally {
      Qh();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = rg(t, e),
      l = Fr,
      c = r & G.Host ? e[xt][ot] : null;
    for (
      (a === -1 || r & G.SkipSelf) &&
      ((l = a === -1 ? eu(t, e) : e[a + 8]),
      l === Fr || !Rp(r, !1)
        ? (a = -1)
        : ((s = e[z]), (a = gs(l)), (e = ms(l, e))));
      a !== -1;

    ) {
      let u = e[z];
      if (Np(o, a, u.data)) {
        let d = mD(a, e, n, s, r, c);
        if (d !== jt) return d;
      }
      (l = e[a + 8]),
        l !== Fr && Rp(r, e[z].data[a + 8] === c) && Np(o, a, e)
          ? ((s = u), (a = gs(l)), (e = ms(l, e)))
          : (a = -1);
    }
  }
  return i;
}
function mD(t, e, n, r, i, o) {
  let s = e[z],
    a = s.data[t + 8],
    l = r == null ? ks(a) && Jl : r != s && (a.type & 3) !== 0,
    c = i & G.Host && o === a,
    u = as(a, s, n, l, c);
  return u !== null ? Ur(e, s, u, a) : jt;
}
function as(t, e, n, r, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    l = t.directiveStart,
    c = t.directiveEnd,
    u = o >> 20,
    d = r ? a : a + u,
    f = i ? a + u : c;
  for (let p = d; p < f; p++) {
    let h = s[p];
    if ((p < l && n === h) || (p >= l && h.type === n)) return p;
  }
  if (i) {
    let p = s[l];
    if (p && nr(p) && p.type === n) return l;
  }
  return null;
}
function Ur(t, e, n, r) {
  let i = t[n],
    o = e.data;
  if (aD(i)) {
    let s = i;
    s.resolving && U0(V0(o[n]));
    let a = vs(s.canSeeViewProviders);
    s.resolving = !0;
    let l,
      c = s.injectImpl ? qe(s.injectImpl) : null,
      u = Wh(t, r, G.Default);
    try {
      (i = t[n] = s.factory(void 0, o, t, r)),
        e.firstCreatePass && n >= r.directiveStart && oD(n, o[n], e);
    } finally {
      c !== null && qe(c), vs(a), (s.resolving = !1), Qh();
    }
  }
  return i;
}
function vD(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Ei) ? t[Ei] : void 0;
  return typeof e == 'number' ? (e >= 0 ? e & eg : yD) : e;
}
function Np(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> tg)] & r);
}
function Rp(t, e) {
  return !(t & G.Self) && !(t & G.Host && e);
}
var Jn = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return sg(this._tNode, this._lView, e, Ns(r), n);
  }
};
function yD() {
  return new Jn(ze(), K());
}
function cr(t) {
  return Oi(() => {
    let e = t.prototype.constructor,
      n = e[us] || Xl(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let o = i[us] || Xl(i);
      if (o && o !== n) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Xl(t) {
  return oh(t)
    ? () => {
        let e = Xl(vt(t));
        return e && e();
      }
    : Xn(t);
}
function wD(t, e, n, r, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[O] & 2048 && !(s[O] & 512); ) {
    let a = ag(o, s, n, r | G.Self, jt);
    if (a !== jt) return a;
    let l = o.parent;
    if (!l) {
      let c = s[xh];
      if (c) {
        let u = c.get(n, jt, r);
        if (u !== jt) return u;
      }
      (l = lg(s)), (s = s[Wr]);
    }
    o = l;
  }
  return i;
}
function lg(t) {
  let e = t[z],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[ot] : null;
}
function tu(t) {
  return gD(ze(), t);
}
function Op(t, e = null, n = null, r) {
  let i = cg(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function cg(t, e = null, n = null, r, i = new Set()) {
  let o = [n || Ge, Uc(t)];
  return (
    (r = r || (typeof t == 'object' ? void 0 : Ke(t))),
    new _i(o, e || $c(), r || null, i)
  );
}
var Nn = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Op({ name: '' }, i, r, '');
      {
        let o = r.name ?? '';
        return Op({ name: o }, r.parent, r.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Ci),
    (e.NULL = new ps()),
    (e.ɵprov = I({ token: e, providedIn: 'any', factory: () => x(hh) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var DD = 'ngOriginalError';
function Nl(t) {
  return t[DD];
}
var Ut = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error('ERROR', e),
        n && this._console.error('ORIGINAL ERROR', n);
    }
    _findOriginalError(e) {
      let n = e && Nl(e);
      for (; n && Nl(n); ) n = Nl(n);
      return n || null;
    }
  },
  ug = new V('', {
    providedIn: 'root',
    factory: () => D(Ut).handleError.bind(void 0),
  }),
  nu = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = ED), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  ec = class extends nu {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return Vh(this._lView, e), () => Uw(this._lView, e);
    }
  };
function ED() {
  return new ec(K());
}
function CD() {
  return Qr(ze(), K());
}
function Qr(t, e) {
  return new we(yt(t, e));
}
var we = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = CD;
  let t = e;
  return t;
})();
function bD(t) {
  return t instanceof we ? t.nativeElement : t;
}
var tc = class extends xe {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      Ah() && (this.destroyRef = D(nu, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let n = te(null);
    try {
      super.next(e);
    } finally {
      te(n);
    }
  }
  subscribe(e, n, r) {
    let i = e,
      o = n || (() => null),
      s = r;
    if (e && typeof e == 'object') {
      let l = e;
      (i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
    }
    this.__isAsync && ((o = Rl(o)), i && (i = Rl(i)), s && (s = Rl(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof Se && e.add(a), a;
  }
};
function Rl(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var Ce = tc;
function _D() {
  return this._results[Symbol.iterator]();
}
var nc = class t {
  get changes() {
    return (this._changes ??= new Ce());
  }
  constructor(e = !1) {
    (this._emitDistinctChangesOnly = e),
      (this.dirty = !0),
      (this._onDirty = void 0),
      (this._results = []),
      (this._changesDetected = !1),
      (this._changes = void 0),
      (this.length = 0),
      (this.first = void 0),
      (this.last = void 0);
    let n = t.prototype;
    n[Symbol.iterator] || (n[Symbol.iterator] = _D);
  }
  get(e) {
    return this._results[e];
  }
  map(e) {
    return this._results.map(e);
  }
  filter(e) {
    return this._results.filter(e);
  }
  find(e) {
    return this._results.find(e);
  }
  reduce(e, n) {
    return this._results.reduce(e, n);
  }
  forEach(e) {
    this._results.forEach(e);
  }
  some(e) {
    return this._results.some(e);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(e, n) {
    this.dirty = !1;
    let r = J0(e);
    (this._changesDetected = !Z0(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.emit(this);
  }
  onDirty(e) {
    this._onDirty = e;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
};
function dg(t) {
  return (t.flags & 128) === 128;
}
var fg = new Map(),
  ID = 0;
function SD() {
  return ID++;
}
function TD(t) {
  fg.set(t[Ls], t);
}
function MD(t) {
  fg.delete(t[Ls]);
}
var Pp = '__ngContext__';
function Sn(t, e) {
  Zn(e) ? ((t[Pp] = e[Ls]), TD(e)) : (t[Pp] = e);
}
function pg(t) {
  return gg(t[Ti]);
}
function hg(t) {
  return gg(t[Tt]);
}
function gg(t) {
  for (; t !== null && !ln(t); ) t = t[Tt];
  return t;
}
var rc;
function mg(t) {
  rc = t;
}
function AD() {
  if (rc !== void 0) return rc;
  if (typeof document < 'u') return document;
  throw new v(210, !1);
}
var zs = new V('', { providedIn: 'root', factory: () => xD }),
  xD = 'ng',
  ru = new V(''),
  wt = new V('', { providedIn: 'platform', factory: () => 'unknown' });
var iu = new V(''),
  ou = new V('', {
    providedIn: 'root',
    factory: () =>
      AD().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
      null,
  });
var ND = 'h',
  RD = 'b';
var OD = () => null;
function su(t, e, n = !1) {
  return OD(t, e, n);
}
var vg = !1,
  PD = new V('', { providedIn: 'root', factory: () => vg });
var ts;
function FD() {
  if (ts === void 0 && ((ts = null), Re.trustedTypes))
    try {
      ts = Re.trustedTypes.createPolicy('angular#unsafe-bypass', {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return ts;
}
function Fp(t) {
  return FD()?.createScriptURL(t) || t;
}
var ys = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${nh})`;
  }
};
function ji(t) {
  return t instanceof ys ? t.changingThisBreaksApplicationSecurity : t;
}
function au(t, e) {
  let n = LD(t);
  if (n != null && n !== e) {
    if (n === 'ResourceURL' && e === 'URL') return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${nh})`);
  }
  return n === e;
}
function LD(t) {
  return (t instanceof ys && t.getTypeName()) || null;
}
var kD = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function yg(t) {
  return (t = String(t)), t.match(kD) ? t : 'unsafe:' + t;
}
var Ws = (function (t) {
  return (
    (t[(t.NONE = 0)] = 'NONE'),
    (t[(t.HTML = 1)] = 'HTML'),
    (t[(t.STYLE = 2)] = 'STYLE'),
    (t[(t.SCRIPT = 3)] = 'SCRIPT'),
    (t[(t.URL = 4)] = 'URL'),
    (t[(t.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    t
  );
})(Ws || {});
function lu(t) {
  let e = Dg();
  return e ? e.sanitize(Ws.URL, t) || '' : au(t, 'URL') ? ji(t) : yg(xs(t));
}
function jD(t) {
  let e = Dg();
  if (e) return Fp(e.sanitize(Ws.RESOURCE_URL, t) || '');
  if (au(t, 'ResourceURL')) return Fp(ji(t));
  throw new v(904, !1);
}
function BD(t, e) {
  return (e === 'src' &&
    (t === 'embed' ||
      t === 'frame' ||
      t === 'iframe' ||
      t === 'media' ||
      t === 'script')) ||
    (e === 'href' && (t === 'base' || t === 'link'))
    ? jD
    : lu;
}
function wg(t, e, n) {
  return BD(e, n)(t);
}
function Dg() {
  let t = K();
  return t && t[At].sanitizer;
}
var VD = /^>|^->|<!--|-->|--!>|<!-$/g,
  UD = /(<|>)/g,
  HD = '\u200B$1\u200B';
function $D(t) {
  return t.replace(VD, (e) => e.replace(UD, HD));
}
function Eg(t) {
  return t instanceof Function ? t() : t;
}
function zD(t) {
  return (t ?? D(Nn)).get(wt) === 'browser';
}
var Ht = (function (t) {
    return (
      (t[(t.Important = 1)] = 'Important'),
      (t[(t.DashCase = 2)] = 'DashCase'),
      t
    );
  })(Ht || {}),
  WD;
function cu(t, e) {
  return WD(t, e);
}
function Rr(t, e, n, r, i) {
  if (r != null) {
    let o,
      s = !1;
    ln(r) ? (o = r) : Zn(r) && ((s = !0), (r = r[an]));
    let a = Vt(r);
    t === 0 && n !== null
      ? i == null
        ? Tg(e, n, a)
        : ws(e, n, a, i || null, !0)
      : t === 1 && n !== null
        ? ws(e, n, a, i || null, !0)
        : t === 2
          ? aE(e, a, s)
          : t === 3 && e.destroyNode(a),
      o != null && cE(e, t, o, n, i);
  }
}
function qD(t, e) {
  return t.createText(e);
}
function GD(t, e, n) {
  t.setValue(e, n);
}
function KD(t, e) {
  return t.createComment($D(e));
}
function Cg(t, e, n) {
  return t.createElement(e, n);
}
function QD(t, e) {
  bg(t, e), (e[an] = null), (e[ot] = null);
}
function YD(t, e, n, r, i, o) {
  (r[an] = i), (r[ot] = e), Gs(t, r, n, 1, i, o);
}
function bg(t, e) {
  e[At].changeDetectionScheduler?.notify(1), Gs(t, e, e[ye], 2, null, null);
}
function ZD(t) {
  let e = t[Ti];
  if (!e) return Ol(t[z], t);
  for (; e; ) {
    let n = null;
    if (Zn(e)) n = e[Ti];
    else {
      let r = e[it];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[Tt] && e !== t; ) Zn(e) && Ol(e[z], e), (e = e[Be]);
      e === null && (e = t), Zn(e) && Ol(e[z], e), (n = e && e[Tt]);
    }
    e = n;
  }
}
function JD(t, e, n, r) {
  let i = it + r,
    o = n.length;
  r > 0 && (n[i - 1][Tt] = e),
    r < o - it
      ? ((e[Tt] = n[i]), ph(n, it + r, e))
      : (n.push(e), (e[Tt] = null)),
    (e[Be] = n);
  let s = e[Li];
  s !== null && n !== s && XD(s, e);
  let a = e[rn];
  a !== null && a.insertView(t), Yl(e), (e[O] |= 128);
}
function XD(t, e) {
  let n = t[Br],
    i = e[Be][Be][xt];
  e[xt] !== i && (t[O] |= zc.HasTransplantedViews),
    n === null ? (t[Br] = [e]) : n.push(e);
}
function _g(t, e) {
  let n = t[Br],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function ic(t, e) {
  if (t.length <= it) return;
  let n = it + e,
    r = t[n];
  if (r) {
    let i = r[Li];
    i !== null && i !== t && _g(i, r), e > 0 && (t[n - 1][Tt] = r[Tt]);
    let o = fs(t, it + e);
    QD(r[z], r);
    let s = o[rn];
    s !== null && s.detachView(o[z]),
      (r[Be] = null),
      (r[Tt] = null),
      (r[O] &= -129);
  }
  return r;
}
function Ig(t, e) {
  if (!(e[O] & 256)) {
    let n = e[ye];
    n.destroyNode && Gs(t, e, n, 3, null, null), ZD(e);
  }
}
function Ol(t, e) {
  if (e[O] & 256) return;
  let n = te(null);
  try {
    (e[O] &= -129),
      (e[O] |= 256),
      e[er] && Lf(e[er]),
      tE(t, e),
      eE(t, e),
      e[z].type === 1 && e[ye].destroy();
    let r = e[Li];
    if (r !== null && ln(e[Be])) {
      r !== e[Be] && _g(r, e);
      let i = e[rn];
      i !== null && i.detachView(t);
    }
    MD(e);
  } finally {
    te(n);
  }
}
function eE(t, e) {
  let n = t.cleanup,
    r = e[Si];
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == 'string') {
        let s = n[o + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
      } else {
        let s = r[n[o + 1]];
        n[o].call(s);
      }
  r !== null && (e[Si] = null);
  let i = e[_n];
  if (i !== null) {
    e[_n] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function tE(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof xi)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              l = o[s + 1];
            kt(4, a, l);
            try {
              l.call(a);
            } finally {
              kt(5, a, l);
            }
          }
        else {
          kt(4, i, o);
          try {
            o.call(i);
          } finally {
            kt(5, i, o);
          }
        }
      }
    }
}
function Sg(t, e, n) {
  return nE(t, e.parent, n);
}
function nE(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[an];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: o } = t.data[r.directiveStart + i];
      if (o === Bt.None || o === Bt.Emulated) return null;
    }
    return yt(r, n);
  }
}
function ws(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function Tg(t, e, n) {
  t.appendChild(e, n);
}
function Lp(t, e, n, r, i) {
  r !== null ? ws(t, e, n, r, i) : Tg(t, e, n);
}
function rE(t, e, n, r) {
  t.removeChild(e, n, r);
}
function uu(t, e) {
  return t.parentNode(e);
}
function iE(t, e) {
  return t.nextSibling(e);
}
function Mg(t, e, n) {
  return sE(t, e, n);
}
function oE(t, e, n) {
  return t.type & 40 ? yt(t, n) : null;
}
var sE = oE,
  kp;
function qs(t, e, n, r) {
  let i = Sg(t, r, e),
    o = e[ye],
    s = r.parent || e[ot],
    a = Mg(s, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let l = 0; l < n.length; l++) Lp(o, i, n[l], a, !1);
    else Lp(o, i, n, a, !1);
  kp !== void 0 && kp(o, r, e, n, i);
}
function ls(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return yt(e, t);
    if (n & 4) return oc(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return ls(t, r);
      {
        let i = t[e.index];
        return ln(i) ? oc(-1, i) : Vt(i);
      }
    } else {
      if (n & 32) return cu(e, t)() || Vt(t[e.index]);
      {
        let r = Ag(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Ai(t[xt]);
          return ls(i, r);
        } else return ls(t, e.next);
      }
    }
  }
  return null;
}
function Ag(t, e) {
  if (e !== null) {
    let r = t[xt][ot],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function oc(t, e) {
  let n = it + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[z].firstChild;
    if (i !== null) return ls(r, i);
  }
  return e[tr];
}
function aE(t, e, n) {
  let r = uu(t, e);
  r && rE(t, r, e, n);
}
function du(t, e, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      l = n.type;
    if (
      (s && e === 0 && (a && Sn(Vt(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (l & 8) du(t, e, n.child, r, i, o, !1), Rr(e, t, i, a, o);
      else if (l & 32) {
        let c = cu(n, r),
          u;
        for (; (u = c()); ) Rr(e, t, i, u, o);
        Rr(e, t, i, a, o);
      } else l & 16 ? xg(t, e, r, n, i, o) : Rr(e, t, i, a, o);
    n = s ? n.projectionNext : n.next;
  }
}
function Gs(t, e, n, r, i, o) {
  du(n, r, t.firstChild, e, i, o, !1);
}
function lE(t, e, n) {
  let r = e[ye],
    i = Sg(t, n, e),
    o = n.parent || e[ot],
    s = Mg(o, n, e);
  xg(r, 0, e, n, i, s);
}
function xg(t, e, n, r, i, o) {
  let s = n[xt],
    l = s[ot].projection[r.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let u = l[c];
      Rr(e, t, i, u, o);
    }
  else {
    let c = l,
      u = s[Be];
    dg(r) && (c.flags |= 128), du(t, e, c, u, i, o, !0);
  }
}
function cE(t, e, n, r, i) {
  let o = n[tr],
    s = Vt(n);
  o !== s && Rr(e, t, r, o, i);
  for (let a = it; a < n.length; a++) {
    let l = n[a];
    Gs(l[z], l, t, e, r, o);
  }
}
function uE(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let o = r.indexOf('-') === -1 ? void 0 : Ht.DashCase;
    i == null
      ? t.removeStyle(n, r, o)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (o |= Ht.Important)),
        t.setStyle(n, r, i, o));
  }
}
function dE(t, e, n) {
  t.setAttribute(e, 'style', n);
}
function Ng(t, e, n) {
  n === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', n);
}
function Rg(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  r !== null && zl(t, e, r),
    i !== null && Ng(t, e, i),
    o !== null && dE(t, e, o);
}
var cn = {};
function y(t = 1) {
  Og(Pe(), K(), Kr() + t, !1);
}
function Og(t, e, n, r) {
  if (!r)
    if ((e[O] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && os(e, o, n);
    } else {
      let o = t.preOrderHooks;
      o !== null && ss(e, o, 0, n);
    }
  rr(n);
}
function b(t, e = G.Default) {
  let n = K();
  if (n === null) return x(t, e);
  let r = ze();
  return sg(r, n, vt(t), e);
}
function Pg() {
  let t = 'invalid';
  throw new Error(t);
}
function Fg(t, e, n, r, i, o) {
  let s = te(null);
  try {
    let a = null;
    i & j.SignalBased && (a = e[r][Wn]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & j.HasDecoratorInputTransform && (o = t.inputTransforms[r].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, n, r) : Rh(e, a, r, o);
  } finally {
    te(s);
  }
}
function fE(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) rr(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          Jw(s, o);
          let l = e[o];
          a(2, l);
        }
      }
    } finally {
      rr(-1);
    }
}
function Ks(t, e, n, r, i, o, s, a, l, c, u) {
  let d = e.blueprint.slice();
  return (
    (d[an] = i),
    (d[O] = r | 4 | 128 | 8 | 64),
    (c !== null || (t && t[O] & 2048)) && (d[O] |= 2048),
    Bh(d),
    (d[Be] = d[Wr] = t),
    (d[Mt] = n),
    (d[At] = s || (t && t[At])),
    (d[ye] = a || (t && t[ye])),
    (d[jr] = l || (t && t[jr]) || null),
    (d[ot] = o),
    (d[Ls] = SD()),
    (d[Ii] = u),
    (d[xh] = c),
    (d[xt] = e.type == 2 ? t[xt] : d),
    d
  );
}
function Yr(t, e, n, r, i) {
  let o = t.data[e];
  if (o === null) (o = pE(t, e, n, r, i)), Zw() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = n), (o.value = r), (o.attrs = i);
    let s = Gw();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return lr(o, !0), o;
}
function pE(t, e, n, r, i) {
  let o = $h(),
    s = Qc(),
    a = s ? o : o && o.parent,
    l = (t.data[e] = wE(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = l),
    o !== null &&
      (s
        ? o.child == null && l.parent !== null && (o.child = l)
        : o.next === null && ((o.next = l), (l.prev = o))),
    l
  );
}
function Lg(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let o = 0; o < n; o++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function kg(t, e, n, r, i) {
  let o = Kr(),
    s = r & 2;
  try {
    rr(-1), s && e.length > Ye && Og(t, e, Ye, !1), kt(s ? 2 : 0, i), n(r, i);
  } finally {
    rr(o), kt(s ? 3 : 1, i);
  }
}
function fu(t, e, n) {
  if (Wc(e)) {
    let r = te(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let l = n[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      te(r);
    }
  }
}
function pu(t, e, n) {
  Uh() && (IE(t, e, n, yt(n, e)), (n.flags & 64) === 64 && Vg(t, e, n));
}
function hu(t, e, n = yt) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function jg(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = gu(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id,
      ))
    : e;
}
function gu(t, e, n, r, i, o, s, a, l, c, u) {
  let d = Ye + r,
    f = d + i,
    p = hE(d, f),
    h = typeof c == 'function' ? c() : c;
  return (p[z] = {
    type: t,
    blueprint: p,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: p.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: l,
    consts: h,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function hE(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : cn);
  return n;
}
function gE(t, e, n, r) {
  let o = r.get(PD, vg) || n === Bt.ShadowDom,
    s = t.selectRootElement(e, o);
  return mE(s), s;
}
function mE(t) {
  vE(t);
}
var vE = () => null;
function yE(t, e, n, r) {
  let i = $g(e);
  i.push(n), t.firstCreatePass && zg(t).push(r, i.length - 1);
}
function wE(t, e, n, r, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Hh() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function jp(t, e, n, r, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    r ??= {};
    let a,
      l = j.None;
    Array.isArray(s) ? ((a = s[0]), (l = s[1])) : (a = s);
    let c = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      c = i[o];
    }
    t === 0 ? Bp(r, n, c, a, l) : Bp(r, n, c, a);
  }
  return r;
}
function Bp(t, e, n, r, i) {
  let o;
  t.hasOwnProperty(n) ? (o = t[n]).push(e, r) : (o = t[n] = [e, r]),
    i !== void 0 && o.push(i);
}
function DE(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    l = null,
    c = null;
  for (let u = r; u < i; u++) {
    let d = o[u],
      f = n ? n.get(d) : null,
      p = f ? f.inputs : null,
      h = f ? f.outputs : null;
    (l = jp(0, d.inputs, u, l, p)), (c = jp(1, d.outputs, u, c, h));
    let g = l !== null && s !== null && !Vc(e) ? LE(l, u, s) : null;
    a.push(g);
  }
  l !== null &&
    (l.hasOwnProperty('class') && (e.flags |= 8),
    l.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = l),
    (e.outputs = c);
}
function EE(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
      ? 'htmlFor'
      : t === 'formaction'
        ? 'formAction'
        : t === 'innerHtml'
          ? 'innerHTML'
          : t === 'readonly'
            ? 'readOnly'
            : t === 'tabindex'
              ? 'tabIndex'
              : t;
}
function mu(t, e, n, r, i, o, s, a) {
  let l = yt(e, n),
    c = e.inputs,
    u;
  !a && c != null && (u = c[r])
    ? (yu(t, n, u, r, i), ks(e) && CE(n, e.index))
    : e.type & 3
      ? ((r = EE(r)),
        (i = s != null ? s(i, e.value || '', r) : i),
        o.setProperty(l, r, i))
      : e.type & 12;
}
function CE(t, e) {
  let n = An(e, t);
  n[O] & 16 || (n[O] |= 64);
}
function vu(t, e, n, r) {
  if (Uh()) {
    let i = r === null ? null : { '': -1 },
      o = TE(t, n),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Bg(t, e, n, s, i, a),
      i && ME(n, r, i);
  }
  n.mergedAttrs = bi(n.mergedAttrs, n.attrs);
}
function Bg(t, e, n, r, i, o) {
  for (let c = 0; c < r.length; c++) hD(ng(n, e), t, r[c].type);
  xE(n, t.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let u = r[c];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    l = Lg(t, e, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let u = r[c];
    (n.mergedAttrs = bi(n.mergedAttrs, u.hostAttrs)),
      NE(t, n, e, l, u),
      AE(l, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      l++;
  }
  DE(t, n, o);
}
function bE(t, e, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    _E(s) != a && s.push(a), s.push(n, r, o);
  }
}
function _E(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function IE(t, e, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd;
  ks(n) && RE(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || ng(n, e),
    Sn(r, e);
  let s = n.initialInputs;
  for (let a = i; a < o; a++) {
    let l = t.data[a],
      c = Ur(e, t, a, n);
    if ((Sn(c, e), s !== null && FE(e, a - i, c, l, n, s), nr(l))) {
      let u = An(n.index, e);
      u[Mt] = Ur(e, t, a, n);
    }
  }
}
function Vg(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = Xw();
  try {
    rr(o);
    for (let a = r; a < i; a++) {
      let l = t.data[a],
        c = e[a];
      Zl(a),
        (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) &&
          SE(l, c);
    }
  } finally {
    rr(-1), Zl(s);
  }
}
function SE(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function TE(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      if (wh(e, s.selectors, !1))
        if ((r || (r = []), nr(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s);
            let l = a.length;
            sc(t, e, l);
          } else r.unshift(s), sc(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
    }
  return r === null ? null : [r, i];
}
function sc(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function ME(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = n[e[i + 1]];
      if (o == null) throw new v(-301, !1);
      r.push(e[i], o);
    }
  }
}
function AE(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    nr(e) && (n[''] = t);
  }
}
function xE(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function NE(t, e, n, r, i) {
  t.data[r] = i;
  let o = i.factory || (i.factory = Xn(i.type, !0)),
    s = new xi(o, nr(i), b);
  (t.blueprint[r] = s), (n[r] = s), bE(t, e, r, Lg(t, n, i.hostVars, cn), i);
}
function RE(t, e, n) {
  let r = yt(e, t),
    i = jg(n),
    o = t[At].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Qs(
    t,
    Ks(t, i, null, s, r, e, null, o.createRenderer(r, n), null, null, null),
  );
  t[e.index] = a;
}
function OE(t, e, n, r, i, o) {
  let s = yt(t, e);
  PE(e[ye], s, o, t.value, n, r, i);
}
function PE(t, e, n, r, i, o, s) {
  if (o == null) t.removeAttribute(e, i, n);
  else {
    let a = s == null ? xs(o) : s(o, r || '', i);
    t.setAttribute(e, i, a, n);
  }
}
function FE(t, e, n, r, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let l = s[a++],
        c = s[a++],
        u = s[a++],
        d = s[a++];
      Fg(r, n, l, c, u, d);
    }
}
function LE(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == 'number') break;
    if (t.hasOwnProperty(o)) {
      r === null && (r = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          r.push(o, s[a + 1], s[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function Ug(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function Hg(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = te(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Zc(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      te(r);
    }
  }
}
function Qs(t, e) {
  return t[Ti] ? (t[Mp][Tt] = e) : (t[Ti] = e), (t[Mp] = e), e;
}
function ac(t, e, n) {
  Zc(0);
  let r = te(null);
  try {
    e(t, n);
  } finally {
    te(r);
  }
}
function $g(t) {
  return t[Si] || (t[Si] = []);
}
function zg(t) {
  return t.cleanup || (t.cleanup = []);
}
function Wg(t, e) {
  let n = t[jr],
    r = n ? n.get(Ut, null) : null;
  r && r.handleError(e);
}
function yu(t, e, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      l = n[o++],
      c = e[s],
      u = t.data[s];
    Fg(u, c, r, a, l, i);
  }
}
function kE(t, e, n) {
  let r = kh(e, t);
  GD(t[ye], r, n);
}
function jE(t, e) {
  let n = An(e, t),
    r = n[z];
  BE(r, n);
  let i = n[an];
  i !== null && n[Ii] === null && (n[Ii] = su(i, n[jr])), wu(r, n, n[Mt]);
}
function BE(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function wu(t, e, n) {
  Jc(e);
  try {
    let r = t.viewQuery;
    r !== null && ac(1, r, n);
    let i = t.template;
    i !== null && kg(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[rn]?.finishViewCreation(t),
      t.staticContentQueries && Hg(t, e),
      t.staticViewQueries && ac(2, t.viewQuery, n);
    let o = t.components;
    o !== null && VE(e, o);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[O] &= -5), Xc();
  }
}
function VE(t, e) {
  for (let n = 0; n < e.length; n++) jE(t, e[n]);
}
function UE(t, e, n, r) {
  let i = te(null);
  try {
    let o = e.tView,
      a = t[O] & 4096 ? 4096 : 16,
      l = Ks(
        t,
        o,
        n,
        a,
        null,
        e,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      c = t[e.index];
    l[Li] = c;
    let u = t[rn];
    return u !== null && (l[rn] = u.createEmbeddedView(o)), wu(o, l, n), l;
  } finally {
    te(i);
  }
}
function Vp(t, e) {
  return !e || e.firstChild === null || dg(t);
}
function HE(t, e, n, r = !0) {
  let i = e[z];
  if ((JD(i, e, t, n), r)) {
    let s = oc(n, t),
      a = e[ye],
      l = uu(a, t[tr]);
    l !== null && YD(i, t[ot], a, e, l, s);
  }
  let o = e[Ii];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Ds(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let o = e[n.index];
    o !== null && r.push(Vt(o)), ln(o) && $E(o, r);
    let s = n.type;
    if (s & 8) Ds(t, e, n.child, r);
    else if (s & 32) {
      let a = cu(n, e),
        l;
      for (; (l = a()); ) r.push(l);
    } else if (s & 16) {
      let a = Ag(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let l = Ai(e[xt]);
        Ds(l[z], l, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function $E(t, e) {
  for (let n = it; n < t.length; n++) {
    let r = t[n],
      i = r[z].firstChild;
    i !== null && Ds(r[z], r, i, e);
  }
  t[tr] !== t[an] && e.push(t[tr]);
}
var qg = [];
function zE(t) {
  return t[er] ?? WE(t);
}
function WE(t) {
  let e = qg.pop() ?? Object.create(GE);
  return (e.lView = t), e;
}
function qE(t) {
  t.lView[er] !== t && ((t.lView = null), qg.push(t));
}
var GE = Ee(C({}, ll), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      Mi(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[er] = this;
    },
  }),
  Gg = 100;
function Kg(t, e = !0, n = 0) {
  let r = t[At],
    i = r.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    KE(t, n);
  } catch (s) {
    throw (e && Wg(t, s), s);
  } finally {
    o || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function KE(t, e) {
  lc(t, e);
  let n = 0;
  for (; Kc(t); ) {
    if (n === Gg) throw new v(103, !1);
    n++, lc(t, 1);
  }
}
function QE(t, e, n, r) {
  let i = e[O];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[At].inlineEffectRunner?.flush(), Jc(e);
  let s = null,
    a = null;
  !o && YE(t) && ((a = zE(e)), (s = Pf(a)));
  try {
    Bh(e), Qw(t.bindingStartIndex), n !== null && kg(t, e, n, 2, r);
    let l = (i & 3) === 3;
    if (!o)
      if (l) {
        let d = t.preOrderCheckHooks;
        d !== null && os(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && ss(e, d, 0, null), Al(e, 0);
      }
    if ((ZE(e), Qg(e, 0), t.contentQueries !== null && Hg(t, e), !o))
      if (l) {
        let d = t.contentCheckHooks;
        d !== null && os(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && ss(e, d, 1), Al(e, 1);
      }
    fE(t, e);
    let c = t.components;
    c !== null && Zg(e, c, 0);
    let u = t.viewQuery;
    if ((u !== null && ac(2, u, r), !o))
      if (l) {
        let d = t.viewCheckHooks;
        d !== null && os(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && ss(e, d, 2), Al(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Ml])) {
      for (let d of e[Ml]) d();
      e[Ml] = null;
    }
    o || (e[O] &= -73);
  } catch (l) {
    throw (Mi(e), l);
  } finally {
    a !== null && (Ff(a, s), qE(a)), Xc();
  }
}
function YE(t) {
  return t.type !== 2;
}
function Qg(t, e) {
  for (let n = pg(t); n !== null; n = hg(n))
    for (let r = it; r < n.length; r++) {
      let i = n[r];
      Yg(i, e);
    }
}
function ZE(t) {
  for (let e = pg(t); e !== null; e = hg(e)) {
    if (!(e[O] & zc.HasTransplantedViews)) continue;
    let n = e[Br];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[Be];
      Bw(i);
    }
  }
}
function JE(t, e, n) {
  let r = An(e, t);
  Yg(r, n);
}
function Yg(t, e) {
  Gc(t) && lc(t, e);
}
function lc(t, e) {
  let r = t[z],
    i = t[O],
    o = t[er],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && cl(o))),
    o && (o.dirty = !1),
    (t[O] &= -9217),
    s)
  )
    QE(r, t, r.template, t[Mt]);
  else if (i & 8192) {
    Qg(t, 1);
    let a = r.components;
    a !== null && Zg(t, a, 1);
  }
}
function Zg(t, e, n) {
  for (let r = 0; r < e.length; r++) JE(t, e[r], n);
}
function Du(t) {
  for (t[At].changeDetectionScheduler?.notify(); t; ) {
    t[O] |= 64;
    let e = Ai(t);
    if (xw(t) && !e) return t;
    t = e;
  }
  return null;
}
var ir = class {
    get rootNodes() {
      let e = this._lView,
        n = e[z];
      return Ds(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Mt];
    }
    set context(e) {
      this._lView[Mt] = e;
    }
    get destroyed() {
      return (this._lView[O] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[Be];
        if (ln(e)) {
          let n = e[hs],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (ic(e, r), fs(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Ig(this._lView[z], this._lView);
    }
    onDestroy(e) {
      Vh(this._lView, e);
    }
    markForCheck() {
      Du(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[O] &= -129;
    }
    reattach() {
      Yl(this._lView), (this._lView[O] |= 128);
    }
    detectChanges() {
      (this._lView[O] |= 1024), Kg(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new v(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), bg(this._lView[z], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new v(902, !1);
      (this._appRef = e), Yl(this._lView);
    }
  },
  on = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = tC;
    let t = e;
    return t;
  })(),
  XE = on,
  eC = class extends XE {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n);
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = UE(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new ir(i);
    }
  };
function tC() {
  return Ys(ze(), K());
}
function Ys(t, e) {
  return t.type & 4 ? new eC(e, t, Qr(t, e)) : null;
}
var yP = new RegExp(`^(\\d+)*(${RD}|${ND})*(.*)`);
var nC = () => null;
function Up(t, e) {
  return nC(t, e);
}
var Hr = class {},
  cc = class {},
  Es = class {};
function rC(t) {
  let e = Error(`No component factory found for ${Ke(t)}.`);
  return (e[iC] = t), e;
}
var iC = 'ngComponent';
var uc = class {
    resolveComponentFactory(e) {
      throw rC(e);
    }
  },
  Zs = (() => {
    let e = class e {};
    e.NULL = new uc();
    let t = e;
    return t;
  })(),
  or = class {},
  Nt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => oC();
    let t = e;
    return t;
  })();
function oC() {
  let t = K(),
    e = ze(),
    n = An(e.index, t);
  return (Zn(n) ? n : t)[ye];
}
var sC = (() => {
    let e = class e {};
    e.ɵprov = I({ token: e, providedIn: 'root', factory: () => null });
    let t = e;
    return t;
  })(),
  Pl = {};
var Hp = new Set();
function Bi(t) {
  Hp.has(t) ||
    (Hp.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }));
}
function $p(...t) {}
function aC() {
  let t = typeof Re.requestAnimationFrame == 'function',
    e = Re[t ? 'requestAnimationFrame' : 'setTimeout'],
    n = Re[t ? 'cancelAnimationFrame' : 'clearTimeout'];
  if (typeof Zone < 'u' && e && n) {
    let r = e[Zone.__symbol__('OriginalDelegate')];
    r && (e = r);
    let i = n[Zone.__symbol__('OriginalDelegate')];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var ne = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Ce(!1)),
        (this.onMicrotaskEmpty = new Ce(!1)),
        (this.onStable = new Ce(!1)),
        (this.onError = new Ce(!1)),
        typeof Zone > 'u')
      )
        throw new v(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = aC().nativeRequestAnimationFrame),
        uC(i);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new v(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + i, e, lC, $p, $p);
      try {
        return o.runTask(s, n, r);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  lC = {};
function Eu(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function cC(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Re,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              (t.lastRequestAnimationFrameId = -1),
                dc(t),
                (t.isCheckStableRunning = !0),
                Eu(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {},
          )),
          t.fakeTopEventTask.invoke();
      },
    )),
    dc(t));
}
function uC(t) {
  let e = () => {
    cC(t);
  };
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (dC(a)) return n.invokeTask(i, o, s, a);
      try {
        return zp(t), n.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Wp(t);
      }
    },
    onInvoke: (n, r, i, o, s, a, l) => {
      try {
        return zp(t), n.invoke(i, o, s, a, l);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Wp(t);
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == 'microTask'
            ? ((t._hasPendingMicrotasks = o.microTask), dc(t), Eu(t))
            : o.change == 'macroTask' &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function dc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function zp(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function Wp(t) {
  t._nesting--, Eu(t);
}
function dC(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
var Or = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = 'EarlyRead'),
      (t[(t.Write = 1)] = 'Write'),
      (t[(t.MixedReadWrite = 2)] = 'MixedReadWrite'),
      (t[(t.Read = 3)] = 'Read'),
      t
    );
  })(Or || {}),
  fC = { destroy() {} };
function Js(t, e) {
  !e && Mw(Js);
  let n = e?.injector ?? D(Nn);
  if (!zD(n)) return fC;
  Bi('NgAfterNextRender');
  let r = n.get(Cu),
    i = (r.handler ??= new pc()),
    o = e?.phase ?? Or.MixedReadWrite,
    s = () => {
      i.unregister(l), a();
    },
    a = n.get(nu).onDestroy(s),
    l = sn(
      n,
      () =>
        new fc(o, () => {
          s(), t();
        }),
    );
  return i.register(l), { destroy: s };
}
var fc = class {
    constructor(e, n) {
      (this.phase = e),
        (this.callbackFn = n),
        (this.zone = D(ne)),
        (this.errorHandler = D(Ut, { optional: !0 })),
        D(Hr, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  pc = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Or.EarlyRead]: new Set(),
          [Or.Write]: new Set(),
          [Or.MixedReadWrite]: new Set(),
          [Or.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let n of e) n.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Cu = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let r = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of r) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = I({ token: e, providedIn: 'root', factory: () => new e() });
    let t = e;
    return t;
  })();
function Cs(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) i = Vl(i, a);
      else if (o == 2) {
        let l = a,
          c = e[++s];
        r = Vl(r, l + ': ' + c + ';');
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var bs = class extends Zs {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = In(e);
    return new $r(n, this.ngModule);
  }
};
function qp(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function pC(t) {
  let e = t.toLowerCase();
  return e === 'svg' ? Lh : e === 'math' ? Pw : null;
}
var hc = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = Ns(r);
      let i = this.injector.get(e, Pl, r);
      return i !== Pl || n === Pl ? i : this.parentInjector.get(e, n, r);
    }
  },
  $r = class extends Es {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = qp(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return qp(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = pw(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      let o = te(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Qe ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new hc(e, s) : e,
          l = a.get(or, null);
        if (l === null) throw new v(407, !1);
        let c = a.get(sC, null),
          u = a.get(Cu, null),
          d = a.get(Hr, null),
          f = {
            rendererFactory: l,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: d,
          },
          p = l.createRenderer(null, this.componentDef),
          h = this.componentDef.selectors[0][0] || 'div',
          g = r
            ? gE(p, r, this.componentDef.encapsulation, a)
            : Cg(p, h, pC(h)),
          M = 512;
        this.componentDef.signals
          ? (M |= 4096)
          : this.componentDef.onPush || (M |= 16);
        let A = null;
        g !== null && (A = su(g, a, !0));
        let $ = gu(0, null, null, 1, 0, null, null, null, null, null, null),
          J = Ks(null, $, null, M, null, null, f, p, a, null, A);
        Jc(J);
        let ee, Ve;
        try {
          let ge = this.componentDef,
            me,
            Te = null;
          ge.findHostDirectiveDefs
            ? ((me = []),
              (Te = new Map()),
              ge.findHostDirectiveDefs(ge, me, Te),
              me.push(ge))
            : (me = [ge]);
          let en = hC(J, g),
            vn = gC(en, g, ge, me, J, f, p);
          (Ve = jh($, Ye)),
            g && yC(p, ge, g, r),
            n !== void 0 && wC(Ve, this.ngContentSelectors, n),
            (ee = vC(vn, ge, me, Te, J, [DC])),
            wu($, J, null);
        } finally {
          Xc();
        }
        return new gc(this.componentType, ee, Qr(Ve, J), J, Ve);
      } finally {
        te(o);
      }
    }
  },
  gc = class extends cc {
    constructor(e, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new ir(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let o = this._rootLView;
        yu(o[z], o, i, e, n), this.previousInputValues.set(e, n);
        let s = An(this._tNode.index, o);
        Du(s);
      }
    }
    get injector() {
      return new Jn(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function hC(t, e) {
  let n = t[z],
    r = Ye;
  return (t[r] = e), Yr(n, r, 2, '#host', null);
}
function gC(t, e, n, r, i, o, s) {
  let a = i[z];
  mC(r, t, e, s);
  let l = null;
  e !== null && (l = su(e, i[jr]));
  let c = o.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Ks(i, jg(n), null, u, i[t.index], t, o, c, null, null, l);
  return (
    a.firstCreatePass && sc(a, t, r.length - 1), Qs(i, d), (i[t.index] = d)
  );
}
function mC(t, e, n, r) {
  for (let i of t) e.mergedAttrs = bi(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Cs(e, e.mergedAttrs, !0), n !== null && Rg(r, n, e));
}
function vC(t, e, n, r, i, o) {
  let s = ze(),
    a = i[z],
    l = yt(s, i);
  Bg(a, i, s, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = s.directiveStart + u,
      f = Ur(i, a, d, s);
    Sn(f, i);
  }
  Vg(a, i, s), l && Sn(l, i);
  let c = Ur(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Mt] = i[Mt] = c), o !== null)) for (let u of o) u(c, e);
  return fu(a, s, i), c;
}
function yC(t, e, n, r) {
  if (r) zl(t, n, ['ng-version', '17.3.10']);
  else {
    let { attrs: i, classes: o } = hw(e.selectors[0]);
    i && zl(t, n, i), o && o.length > 0 && Ng(t, n, o.join(' '));
  }
}
function wC(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = n[i];
    r.push(o != null ? Array.from(o) : null);
  }
}
function DC() {
  let t = ze();
  $s(K()[z], t);
}
var un = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = EC;
  let t = e;
  return t;
})();
function EC() {
  let t = ze();
  return Xg(t, K());
}
var CC = un,
  Jg = class extends CC {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Qr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Jn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = eu(this._hostTNode, this._hostLView);
      if (Xh(e)) {
        let n = ms(e, this._hostLView),
          r = gs(e),
          i = n[z].data[r + 8];
        return new Jn(i, n);
      } else return new Jn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = Gp(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - it;
    }
    createEmbeddedView(e, n, r) {
      let i, o;
      typeof r == 'number'
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector));
      let s = Up(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, o, s);
      return this.insertImpl(a, i, Vp(this._hostTNode, s)), a;
    }
    createComponent(e, n, r, i, o) {
      let s = e && !Aw(e),
        a;
      if (s) a = n;
      else {
        let h = n || {};
        (a = h.index),
          (r = h.injector),
          (i = h.projectableNodes),
          (o = h.environmentInjector || h.ngModuleRef);
      }
      let l = s ? e : new $r(In(e)),
        c = r || this.parentInjector;
      if (!o && l.ngModule == null) {
        let g = (s ? c : this.parentInjector).get(Qe, null);
        g && (o = g);
      }
      let u = In(l.componentType ?? {}),
        d = Up(this._lContainer, u?.id ?? null),
        f = d?.firstChild ?? null,
        p = l.create(c, i, f, o);
      return this.insertImpl(p.hostView, a, Vp(this._hostTNode, d)), p;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (jw(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let l = i[Be],
            c = new Jg(l, l[ot], l[Be]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return HE(s, i, o, r), e.attachToViewContainerRef(), ph(Fl(s), o, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = Gp(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = ic(this._lContainer, n);
      r && (fs(Fl(this._lContainer), n), Ig(r[z], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = ic(this._lContainer, n);
      return r && fs(Fl(this._lContainer), n) != null ? new ir(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function Gp(t) {
  return t[hs];
}
function Fl(t) {
  return t[hs] || (t[hs] = []);
}
function Xg(t, e) {
  let n,
    r = e[t.index];
  return (
    ln(r) ? (n = r) : ((n = Ug(r, e, null, t)), (e[t.index] = n), Qs(e, n)),
    _C(n, e, t, r),
    new Jg(n, t, e)
  );
}
function bC(t, e) {
  let n = t[ye],
    r = n.createComment(''),
    i = yt(e, t),
    o = uu(n, i);
  return ws(n, o, r, iE(n, i), !1), r;
}
var _C = TC,
  IC = () => !1;
function SC(t, e, n) {
  return IC(t, e, n);
}
function TC(t, e, n, r) {
  if (t[tr]) return;
  let i;
  n.type & 8 ? (i = Vt(r)) : (i = bC(e, n)), (t[tr] = i);
}
var mc = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  vc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let n = e.queries;
      if (n !== null) {
        let r = e.contentQueries !== null ? e.contentQueries[0] : n.length,
          i = [];
        for (let o = 0; o < r; o++) {
          let s = n.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let n = 0; n < this.queries.length; n++)
        bu(e, n).matches !== null && this.queries[n].setDirty();
    }
  },
  yc = class {
    constructor(e, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof e == 'string' ? (this.predicate = FC(e)) : (this.predicate = e);
    }
  },
  wc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(e, n);
    }
    elementEnd(e) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(e);
    }
    embeddedTView(e) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let i = n !== null ? n.length : 0,
          o = this.getByIndex(r).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = r), n !== null ? n.push(o) : (n = [o]));
      }
      return n !== null ? new t(n) : null;
    }
    template(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(e, n);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  Dc = class t {
    constructor(e, n = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = n);
    }
    elementStart(e, n) {
      this.isApplyingToNode(n) && this.matchTNode(e, n);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, n) {
      this.elementStart(e, n);
    }
    embeddedTView(e, n) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, n),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = e.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let i = 0; i < r.length; i++) {
          let o = r[i];
          this.matchTNodeWithReadOption(e, n, MC(n, o)),
            this.matchTNodeWithReadOption(e, n, as(n, e, o, !1, !1));
        }
      else
        r === on
          ? n.type & 4 && this.matchTNodeWithReadOption(e, n, -1)
          : this.matchTNodeWithReadOption(e, n, as(n, e, r, !1, !1));
    }
    matchTNodeWithReadOption(e, n, r) {
      if (r !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === we || i === un || (i === on && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let o = as(n, e, i, !1, !1);
            o !== null && this.addMatch(n.index, o);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(e, n) {
      this.matches === null ? (this.matches = [e, n]) : this.matches.push(e, n);
    }
  };
function MC(t, e) {
  let n = t.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === e) return n[r + 1];
  }
  return null;
}
function AC(t, e) {
  return t.type & 11 ? Qr(t, e) : t.type & 4 ? Ys(t, e) : null;
}
function xC(t, e, n, r) {
  return n === -1 ? AC(e, t) : n === -2 ? NC(t, e, r) : Ur(t, t[z], n, e);
}
function NC(t, e, n) {
  if (n === we) return Qr(e, t);
  if (n === on) return Ys(e, t);
  if (n === un) return Xg(e, t);
}
function em(t, e, n, r) {
  let i = e[rn].queries[r];
  if (i.matches === null) {
    let o = t.data,
      s = n.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let u = o[c];
        a.push(xC(e, u, s[l + 1], n.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Ec(t, e, n, r) {
  let i = t.queries.getByIndex(n),
    o = i.matches;
  if (o !== null) {
    let s = em(t, e, i, n);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) r.push(s[a / 2]);
      else {
        let c = o[a + 1],
          u = e[-l];
        for (let d = it; d < u.length; d++) {
          let f = u[d];
          f[Li] === f[Be] && Ec(f[z], f, c, r);
        }
        if (u[Br] !== null) {
          let d = u[Br];
          for (let f = 0; f < d.length; f++) {
            let p = d[f];
            Ec(p[z], p, c, r);
          }
        }
      }
    }
  }
  return r;
}
function RC(t, e) {
  return t[rn].queries[e].queryList;
}
function OC(t, e, n) {
  let r = new nc((n & 4) === 4);
  return (
    yE(t, e, r, r.destroy), (e[rn] ??= new vc()).queries.push(new mc(r)) - 1
  );
}
function PC(t, e, n, r) {
  let i = Pe();
  if (i.firstCreatePass) {
    let o = ze();
    LC(i, new yc(e, n, r), o.index),
      kC(i, t),
      (n & 2) === 2 && (i.staticContentQueries = !0);
  }
  return OC(i, K(), n);
}
function FC(t) {
  return t.split(',').map((e) => e.trim());
}
function LC(t, e, n) {
  t.queries === null && (t.queries = new wc()), t.queries.track(new Dc(e, n));
}
function kC(t, e) {
  let n = t.contentQueries || (t.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  e !== r && n.push(t.queries.length - 1, e);
}
function bu(t, e) {
  return t.queries.getByIndex(e);
}
function jC(t, e) {
  let n = t[z],
    r = bu(n, e);
  return r.crossesNgTemplate ? Ec(n, t, e, []) : em(n, t, r, e);
}
function BC(t) {
  return typeof t == 'function' && t[Wn] !== void 0;
}
function Vi(t, e) {
  Bi('NgSignals');
  let n = Hf(t),
    r = n[Wn];
  return (
    e?.equal && (r.equal = e.equal),
    (n.set = (i) => ul(r, i)),
    (n.update = (i) => $f(r, i)),
    (n.asReadonly = VC.bind(n)),
    n
  );
}
function VC() {
  let t = this[Wn];
  if (t.readonlyFn === void 0) {
    let e = () => this();
    (e[Wn] = t), (t.readonlyFn = e);
  }
  return t.readonlyFn;
}
function tm(t) {
  return BC(t) && typeof t.set == 'function';
}
function UC(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Ui(t) {
  let e = UC(t.type),
    n = !0,
    r = [t];
  for (; e; ) {
    let i;
    if (nr(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new v(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (n) {
        r.push(i);
        let s = t;
        (s.inputs = ns(t.inputs)),
          (s.inputTransforms = ns(t.inputTransforms)),
          (s.declaredInputs = ns(t.declaredInputs)),
          (s.outputs = ns(t.outputs));
        let a = i.hostBindings;
        a && qC(t, a);
        let l = i.viewQuery,
          c = i.contentQueries;
        if (
          (l && zC(t, l),
          c && WC(t, c),
          HC(t, i),
          R0(t.outputs, i.outputs),
          nr(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Ui && (n = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  $C(r);
}
function HC(t, e) {
  for (let n in e.inputs) {
    if (!e.inputs.hasOwnProperty(n) || t.inputs.hasOwnProperty(n)) continue;
    let r = e.inputs[n];
    if (
      r !== void 0 &&
      ((t.inputs[n] = r),
      (t.declaredInputs[n] = e.declaredInputs[n]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(r) ? r[0] : r;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function $C(t) {
  let e = 0,
    n = null;
  for (let r = t.length - 1; r >= 0; r--) {
    let i = t[r];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = bi(i.hostAttrs, (n = bi(n, i.hostAttrs))));
  }
}
function ns(t) {
  return t === Lr ? {} : t === Ge ? [] : t;
}
function zC(t, e) {
  let n = t.viewQuery;
  n
    ? (t.viewQuery = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.viewQuery = e);
}
function WC(t, e) {
  let n = t.contentQueries;
  n
    ? (t.contentQueries = (r, i, o) => {
        e(r, i, o), n(r, i, o);
      })
    : (t.contentQueries = e);
}
function qC(t, e) {
  let n = t.hostBindings;
  n
    ? (t.hostBindings = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.hostBindings = e);
}
function Dt(t) {
  let e = t.inputConfig,
    n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r];
      Array.isArray(i) && i[3] && (n[r] = i[3]);
    }
  t.inputTransforms = n;
}
var Tn = class {},
  Ni = class {};
var Cc = class extends Tn {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new bs(this));
      let i = bh(e);
      (this._bootstrapComponents = Eg(i.bootstrap)),
        (this._r3Injector = cg(
          e,
          n,
          [
            { provide: Tn, useValue: this },
            { provide: Zs, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Ke(e),
          new Set(['environment']),
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  bc = class extends Ni {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Cc(this.moduleType, e, []);
    }
  };
var _s = class extends Tn {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new bs(this)),
      (this.instance = null);
    let n = new _i(
      [
        ...e.providers,
        { provide: Tn, useValue: this },
        { provide: Zs, useValue: this.componentFactoryResolver },
      ],
      e.parent || $c(),
      e.debugName,
      new Set(['environment']),
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Xs(t, e, n = null) {
  return new _s({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var ea = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ke(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function nm(t) {
  return _u(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function GC(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function _u(t) {
  return t !== null && (typeof t == 'function' || typeof t == 'object');
}
function Iu(t, e, n) {
  return (t[e] = n);
}
function KC(t, e) {
  return t[e];
}
function Mn(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function Is(t, e, n, r) {
  let i = Mn(t, e, n);
  return Mn(t, e + 1, r) || i;
}
function QC(t, e, n, r, i, o) {
  let s = Is(t, e, n, r);
  return Is(t, e + 2, i, o) || s;
}
function YC(t) {
  return (t.flags & 32) === 32;
}
function ZC(t, e, n, r, i, o, s, a, l) {
  let c = e.consts,
    u = Yr(e, t, 4, s || null, Vr(c, a));
  vu(e, n, u, Vr(c, l)), $s(e, u);
  let d = (u.tView = gu(
    2,
    u,
    r,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null,
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))),
    u
  );
}
function S(t, e, n, r, i, o, s, a) {
  let l = K(),
    c = Pe(),
    u = t + Ye,
    d = c.firstCreatePass ? ZC(u, c, l, e, n, r, i, o, s) : c.data[u];
  lr(d, !1);
  let f = JC(c, l, d, t);
  Us() && qs(c, l, f, d), Sn(f, l);
  let p = Ug(f, l, f, d);
  return (
    (l[u] = p),
    Qs(l, p),
    SC(p, d, l),
    js(d) && pu(c, l, d),
    s != null && hu(l, d, a),
    S
  );
}
var JC = XC;
function XC(t, e, n, r) {
  return Hs(!0), e[ye].createComment('');
}
function ue(t, e, n, r) {
  let i = K(),
    o = Bs();
  if (Mn(i, o, e)) {
    let s = Pe(),
      a = Vs();
    OE(a, i, t, e, n, r);
  }
  return ue;
}
function rm(t, e, n, r) {
  return Mn(t, Bs(), n) ? e + xs(n) + r : cn;
}
function rs(t, e) {
  return (t << 17) | (e << 2);
}
function sr(t) {
  return (t >> 17) & 32767;
}
function eb(t) {
  return (t & 2) == 2;
}
function tb(t, e) {
  return (t & 131071) | (e << 17);
}
function _c(t) {
  return t | 2;
}
function zr(t) {
  return (t & 131068) >> 2;
}
function Ll(t, e) {
  return (t & -131069) | (e << 2);
}
function nb(t) {
  return (t & 1) === 1;
}
function Ic(t) {
  return t | 1;
}
function rb(t, e, n, r, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = sr(s),
    l = zr(s);
  t[r] = n;
  let c = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Fi(d, u) > 0) && (c = !0);
  } else u = n;
  if (i)
    if (l !== 0) {
      let f = sr(t[a + 1]);
      (t[r + 1] = rs(f, a)),
        f !== 0 && (t[f + 1] = Ll(t[f + 1], r)),
        (t[a + 1] = tb(t[a + 1], r));
    } else
      (t[r + 1] = rs(a, 0)), a !== 0 && (t[a + 1] = Ll(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = rs(l, 0)),
      a === 0 ? (a = r) : (t[l + 1] = Ll(t[l + 1], r)),
      (l = r);
  c && (t[r + 1] = _c(t[r + 1])),
    Kp(t, u, r, !0),
    Kp(t, u, r, !1),
    ib(e, u, t, r, o),
    (s = rs(a, l)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function ib(t, e, n, r, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == 'string' &&
    Fi(o, e) >= 0 &&
    (n[r + 1] = Ic(n[r + 1]));
}
function Kp(t, e, n, r) {
  let i = t[n + 1],
    o = e === null,
    s = r ? sr(i) : zr(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = t[s],
      c = t[s + 1];
    ob(l, e) && ((a = !0), (t[s + 1] = r ? Ic(c) : _c(c))),
      (s = r ? sr(c) : zr(c));
  }
  a && (t[n + 1] = r ? _c(i) : Ic(i));
}
function ob(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? Fi(t, e) >= 0
      : !1;
}
var St = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function sb(t) {
  return t.substring(St.key, St.keyEnd);
}
function ab(t) {
  return lb(t), im(t, om(t, 0, St.textEnd));
}
function im(t, e) {
  let n = St.textEnd;
  return n === e ? -1 : ((e = St.keyEnd = cb(t, (St.key = e), n)), om(t, e, n));
}
function lb(t) {
  (St.key = 0),
    (St.keyEnd = 0),
    (St.value = 0),
    (St.valueEnd = 0),
    (St.textEnd = t.length);
}
function om(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++;
  return e;
}
function cb(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++;
  return e;
}
function m(t, e, n) {
  let r = K(),
    i = Bs();
  if (Mn(r, i, e)) {
    let o = Pe(),
      s = Vs();
    mu(o, s, r, t, e, r[ye], n, !1);
  }
  return m;
}
function Sc(t, e, n, r, i) {
  let o = e.inputs,
    s = i ? 'class' : 'style';
  yu(t, n, o[s], s, r);
}
function $t(t) {
  db(yb, ub, t, !0);
}
function ub(t, e) {
  for (let n = ab(e); n >= 0; n = im(e, n)) Bc(t, sb(e), !0);
}
function db(t, e, n, r) {
  let i = Pe(),
    o = Yw(2);
  i.firstUpdatePass && fb(i, null, o, r);
  let s = K();
  if (n !== cn && Mn(s, o, n)) {
    let a = i.data[Kr()];
    if (am(a, r) && !sm(i, o)) {
      let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
      l !== null && (n = Vl(l, n || '')), Sc(i, a, s, n, r);
    } else wb(i, a, s, s[ye], s[o + 1], (s[o + 1] = vb(t, e, n)), r, o);
  }
}
function sm(t, e) {
  return e >= t.expandoStartIndex;
}
function fb(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let o = i[Kr()],
      s = sm(t, n);
    am(o, r) && e === null && !s && (e = !1),
      (e = pb(i, o, e, r)),
      rb(i, o, e, n, s, r);
  }
}
function pb(t, e, n, r) {
  let i = eD(t),
    o = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = kl(null, t, e, n, r)), (n = Ri(n, e.attrs, r)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((n = kl(i, t, e, n, r)), o === null)) {
        let l = hb(t, e, r);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = kl(null, t, e, l[1], r)),
          (l = Ri(l, e.attrs, r)),
          gb(t, e, r, l));
      } else o = mb(t, e, r);
  }
  return (
    o !== void 0 && (r ? (e.residualClasses = o) : (e.residualStyles = o)), n
  );
}
function hb(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (zr(r) !== 0) return t[sr(r)];
}
function gb(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[sr(i)] = r;
}
function mb(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    r = Ri(r, s, n);
  }
  return Ri(r, e.attrs, n);
}
function kl(t, e, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = e[a]), (r = Ri(r, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function Ri(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == 'number'
        ? (i = s)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          Bc(t, s, n ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function vb(t, e, n) {
  if (n == null || n === '') return Ge;
  let r = [],
    i = ji(n);
  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) t(r, i[o], !0);
  else if (typeof i == 'object')
    for (let o in i) i.hasOwnProperty(o) && t(r, o, i[o]);
  else typeof i == 'string' && e(r, i);
  return r;
}
function yb(t, e, n) {
  let r = String(e);
  r !== '' && !r.includes(' ') && Bc(t, r, n);
}
function wb(t, e, n, r, i, o, s, a) {
  i === cn && (i = Ge);
  let l = 0,
    c = 0,
    u = 0 < i.length ? i[0] : null,
    d = 0 < o.length ? o[0] : null;
  for (; u !== null || d !== null; ) {
    let f = l < i.length ? i[l + 1] : void 0,
      p = c < o.length ? o[c + 1] : void 0,
      h = null,
      g;
    u === d
      ? ((l += 2), (c += 2), f !== p && ((h = d), (g = p)))
      : d === null || (u !== null && u < d)
        ? ((l += 2), (h = u))
        : ((c += 2), (h = d), (g = p)),
      h !== null && Db(t, e, n, r, h, g, s, a),
      (u = l < i.length ? i[l] : null),
      (d = c < o.length ? o[c] : null);
  }
}
function Db(t, e, n, r, i, o, s, a) {
  if (!(e.type & 3)) return;
  let l = t.data,
    c = l[a + 1],
    u = nb(c) ? Qp(l, e, n, i, zr(c), s) : void 0;
  if (!Ss(u)) {
    Ss(o) || (eb(c) && (o = Qp(l, null, n, i, a, s)));
    let d = kh(Kr(), n);
    uE(r, s, d, i, o);
  }
}
function Qp(t, e, n, r, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let l = t[i],
      c = Array.isArray(l),
      u = c ? l[1] : l,
      d = u === null,
      f = n[i + 1];
    f === cn && (f = d ? Ge : void 0);
    let p = d ? Sl(f, r) : u === r ? f : void 0;
    if ((c && !Ss(p) && (p = Sl(l, r)), Ss(p) && ((a = p), s))) return a;
    let h = t[i + 1];
    i = s ? sr(h) : zr(h);
  }
  if (e !== null) {
    let l = o ? e.residualClasses : e.residualStyles;
    l != null && (a = Sl(l, r));
  }
  return a;
}
function Ss(t) {
  return t !== void 0;
}
function am(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function Eb(t, e, n, r, i, o) {
  let s = e.consts,
    a = Vr(s, i),
    l = Yr(e, t, 2, r, a);
  return (
    vu(e, n, l, Vr(s, o)),
    l.attrs !== null && Cs(l, l.attrs, !1),
    l.mergedAttrs !== null && Cs(l, l.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, l),
    l
  );
}
function w(t, e, n, r) {
  let i = K(),
    o = Pe(),
    s = Ye + t,
    a = i[ye],
    l = o.firstCreatePass ? Eb(s, o, i, e, n, r) : o.data[s],
    c = Cb(o, i, l, a, e, t);
  i[s] = c;
  let u = js(l);
  return (
    lr(l, !0),
    Rg(a, c, l),
    !YC(l) && Us() && qs(o, i, c, l),
    Hw() === 0 && Sn(c, i),
    $w(),
    u && (pu(o, i, l), fu(o, l, i)),
    r !== null && hu(i, l),
    w
  );
}
function E() {
  let t = ze();
  Qc() ? Yc() : ((t = t.parent), lr(t, !1));
  let e = t;
  Ww(e) && qw(), zw();
  let n = Pe();
  return (
    n.firstCreatePass && ($s(n, t), Wc(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      lD(e) &&
      Sc(n, e, K(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      cD(e) &&
      Sc(n, e, K(), e.stylesWithoutHost, !1),
    E
  );
}
function W(t, e, n, r) {
  return w(t, e, n, r), E(), W;
}
var Cb = (t, e, n, r, i, o) => (Hs(!0), Cg(r, i, iD()));
function bb(t, e, n, r, i) {
  let o = e.consts,
    s = Vr(o, r),
    a = Yr(e, t, 8, 'ng-container', s);
  s !== null && Cs(a, s, !0);
  let l = Vr(o, i);
  return vu(e, n, a, l), e.queries !== null && e.queries.elementStart(e, a), a;
}
function pe(t, e, n) {
  let r = K(),
    i = Pe(),
    o = t + Ye,
    s = i.firstCreatePass ? bb(o, i, r, e, n) : i.data[o];
  lr(s, !0);
  let a = _b(i, r, s, t);
  return (
    (r[o] = a),
    Us() && qs(i, r, a, s),
    Sn(a, r),
    js(s) && (pu(i, r, s), fu(i, s, r)),
    n != null && hu(r, s),
    pe
  );
}
function he() {
  let t = ze(),
    e = Pe();
  return (
    Qc() ? Yc() : ((t = t.parent), lr(t, !1)),
    e.firstCreatePass && ($s(e, t), Wc(t) && e.queries.elementEnd(t)),
    he
  );
}
function Ze(t, e, n) {
  return pe(t, e, n), he(), Ze;
}
var _b = (t, e, n, r) => (Hs(!0), KD(e[ye], ''));
function Su() {
  return K();
}
var Yn = void 0;
function Ib(t) {
  let e = t,
    n = Math.floor(Math.abs(t)),
    r = t.toString().replace(/^[^.]*\.?/, '').length;
  return n === 1 && r === 0 ? 1 : 5;
}
var Sb = [
    'en',
    [['a', 'p'], ['AM', 'PM'], Yn],
    [['AM', 'PM'], Yn, Yn],
    [
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ],
    Yn,
    [
      ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    ],
    Yn,
    [
      ['B', 'A'],
      ['BC', 'AD'],
      ['Before Christ', 'Anno Domini'],
    ],
    0,
    [6, 0],
    ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
    ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
    ['{1}, {0}', Yn, "{1} 'at' {0}", Yn],
    ['.', ',', ';', '%', '+', '-', 'E', '\xD7', '\u2030', '\u221E', 'NaN', ':'],
    ['#,##0.###', '#,##0%', '\xA4#,##0.00', '#E0'],
    'USD',
    '$',
    'US Dollar',
    {},
    'ltr',
    Ib,
  ],
  jl = {};
function Tu(t) {
  let e = Tb(t),
    n = Yp(e);
  if (n) return n;
  let r = e.split('-')[0];
  if (((n = Yp(r)), n)) return n;
  if (r === 'en') return Sb;
  throw new v(701, !1);
}
function Yp(t) {
  return (
    t in jl ||
      (jl[t] =
        Re.ng &&
        Re.ng.common &&
        Re.ng.common.locales &&
        Re.ng.common.locales[t]),
    jl[t]
  );
}
var Zr = (function (t) {
  return (
    (t[(t.LocaleId = 0)] = 'LocaleId'),
    (t[(t.DayPeriodsFormat = 1)] = 'DayPeriodsFormat'),
    (t[(t.DayPeriodsStandalone = 2)] = 'DayPeriodsStandalone'),
    (t[(t.DaysFormat = 3)] = 'DaysFormat'),
    (t[(t.DaysStandalone = 4)] = 'DaysStandalone'),
    (t[(t.MonthsFormat = 5)] = 'MonthsFormat'),
    (t[(t.MonthsStandalone = 6)] = 'MonthsStandalone'),
    (t[(t.Eras = 7)] = 'Eras'),
    (t[(t.FirstDayOfWeek = 8)] = 'FirstDayOfWeek'),
    (t[(t.WeekendRange = 9)] = 'WeekendRange'),
    (t[(t.DateFormat = 10)] = 'DateFormat'),
    (t[(t.TimeFormat = 11)] = 'TimeFormat'),
    (t[(t.DateTimeFormat = 12)] = 'DateTimeFormat'),
    (t[(t.NumberSymbols = 13)] = 'NumberSymbols'),
    (t[(t.NumberFormats = 14)] = 'NumberFormats'),
    (t[(t.CurrencyCode = 15)] = 'CurrencyCode'),
    (t[(t.CurrencySymbol = 16)] = 'CurrencySymbol'),
    (t[(t.CurrencyName = 17)] = 'CurrencyName'),
    (t[(t.Currencies = 18)] = 'Currencies'),
    (t[(t.Directionality = 19)] = 'Directionality'),
    (t[(t.PluralCase = 20)] = 'PluralCase'),
    (t[(t.ExtraData = 21)] = 'ExtraData'),
    t
  );
})(Zr || {});
function Tb(t) {
  return t.toLowerCase().replace(/_/g, '-');
}
var Ts = 'en-US';
var Mb = Ts;
function Ab(t) {
  typeof t == 'string' && (Mb = t.toLowerCase().replace(/_/g, '-'));
}
function st(t, e, n, r) {
  let i = K(),
    o = Pe(),
    s = ze();
  return lm(o, i, i[ye], s, t, e, r), st;
}
function xb(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = e[Si],
          l = i[o + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function lm(t, e, n, r, i, o, s) {
  let a = js(r),
    c = t.firstCreatePass && zg(t),
    u = e[Mt],
    d = $g(e),
    f = !0;
  if (r.type & 3 || s) {
    let g = yt(r, e),
      M = s ? s(g) : g,
      A = d.length,
      $ = s ? (ee) => s(Vt(ee[r.index])) : r.index,
      J = null;
    if ((!s && a && (J = xb(t, e, i, r.index)), J !== null)) {
      let ee = J.__ngLastListenerFn__ || J;
      (ee.__ngNextListenerFn__ = o), (J.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Jp(r, e, u, o, !1);
      let ee = n.listen(M, i, o);
      d.push(o, ee), c && c.push(i, $, A, A + 1);
    }
  } else o = Jp(r, e, u, o, !1);
  let p = r.outputs,
    h;
  if (f && p !== null && (h = p[i])) {
    let g = h.length;
    if (g)
      for (let M = 0; M < g; M += 2) {
        let A = h[M],
          $ = h[M + 1],
          Ve = e[A][$].subscribe(o),
          ge = d.length;
        d.push(o, Ve), c && c.push(i, r.index, ge, -(ge + 1));
      }
  }
}
function Zp(t, e, n, r) {
  let i = te(null);
  try {
    return kt(6, e, n), n(r) !== !1;
  } catch (o) {
    return Wg(t, o), !1;
  } finally {
    kt(7, e, n), te(i);
  }
}
function Jp(t, e, n, r, i) {
  return function o(s) {
    if (s === Function) return r;
    let a = t.componentOffset > -1 ? An(t.index, e) : e;
    Du(a);
    let l = Zp(e, n, r, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (l = Zp(e, n, c, s) && l), (c = c.__ngNextListenerFn__);
    return i && l === !1 && s.preventDefault(), l;
  };
}
function P(t = 1) {
  return nD(t);
}
function Nb(t, e) {
  let n = null,
    r = lw(t);
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    if (o === '*') {
      n = i;
      continue;
    }
    if (r === null ? wh(t, o, !0) : dw(r, o)) return i;
  }
  return n;
}
function Rt(t) {
  let e = K()[xt][ot];
  if (!e.projection) {
    let n = t ? t.length : 1,
      r = (e.projection = X0(n, null)),
      i = r.slice(),
      o = e.child;
    for (; o !== null; ) {
      let s = t ? Nb(o, t) : 0;
      s !== null && (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o)),
        (o = o.next);
    }
  }
}
function at(t, e = 0, n) {
  let r = K(),
    i = Pe(),
    o = Yr(i, Ye + t, 16, null, n || null);
  o.projection === null && (o.projection = e),
    Yc(),
    (!r[Ii] || Hh()) && (o.flags & 32) !== 32 && lE(i, r, o);
}
function Mu(t, e, n) {
  return cm(t, '', e, '', n), Mu;
}
function cm(t, e, n, r, i) {
  let o = K(),
    s = rm(o, e, n, r);
  if (s !== cn) {
    let a = Pe(),
      l = Vs();
    mu(a, l, o, t, s, o[ye], i, !1);
  }
  return cm;
}
function zt(t, e, n, r) {
  PC(t, e, n, r);
}
function Wt(t) {
  let e = K(),
    n = Pe(),
    r = zh();
  Zc(r + 1);
  let i = bu(n, r);
  if (t.dirty && kw(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = jC(e, r);
      t.reset(o, bD), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function qt() {
  return RC(K(), zh());
}
function Rb(t, e, n, r) {
  n >= t.data.length && ((t.data[n] = null), (t.blueprint[n] = null)),
    (e[n] = r);
}
function Je(t) {
  let e = Kw();
  return qc(e, Ye + t);
}
function B(t, e = '') {
  let n = K(),
    r = Pe(),
    i = t + Ye,
    o = r.firstCreatePass ? Yr(r, i, 1, e, null) : r.data[i],
    s = Ob(r, n, o, e, t);
  (n[i] = s), Us() && qs(r, n, s, o), lr(o, !1);
}
var Ob = (t, e, n, r, i) => (Hs(!0), qD(e[ye], r));
function lt(t) {
  return Gt('', t, ''), lt;
}
function Gt(t, e, n) {
  let r = K(),
    i = rm(r, t, e, n);
  return i !== cn && kE(r, Kr(), i), Gt;
}
function Au(t, e, n) {
  tm(e) && (e = e());
  let r = K(),
    i = Bs();
  if (Mn(r, i, e)) {
    let o = Pe(),
      s = Vs();
    mu(o, s, r, t, e, r[ye], n, !1);
  }
  return Au;
}
function um(t, e) {
  let n = tm(t);
  return n && t.set(e), n;
}
function xu(t, e) {
  let n = K(),
    r = Pe(),
    i = ze();
  return lm(r, n, n[ye], i, t, e), xu;
}
var Pb = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = Sh(!1, r.type),
          o =
            i.length > 0
              ? Xs([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, o);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = I({
    token: e,
    providedIn: 'environment',
    factory: () => new e(x(Qe)),
  });
  let t = e;
  return t;
})();
function q(t) {
  Bi('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(Pb).getOrCreateStandaloneInjector(t));
}
function Kt(t, e, n, r) {
  return hm(K(), ki(), t, e, n, r);
}
function dm(t, e, n, r, i) {
  return gm(K(), ki(), t, e, n, r, i);
}
function fm(t, e, n, r, i, o, s, a, l) {
  let c = ki() + t,
    u = K(),
    d = QC(u, c, n, r, i, o);
  return Is(u, c + 4, s, a) || d
    ? Iu(u, c + 6, l ? e.call(l, n, r, i, o, s, a) : e(n, r, i, o, s, a))
    : KC(u, c + 6);
}
function pm(t, e) {
  let n = t[e];
  return n === cn ? void 0 : n;
}
function hm(t, e, n, r, i, o) {
  let s = e + n;
  return Mn(t, s, i) ? Iu(t, s + 1, o ? r.call(o, i) : r(i)) : pm(t, s + 1);
}
function gm(t, e, n, r, i, o, s) {
  let a = e + n;
  return Is(t, a, i, o)
    ? Iu(t, a + 2, s ? r.call(s, i, o) : r(i, o))
    : pm(t, a + 2);
}
function Jr(t, e) {
  let n = Pe(),
    r,
    i = t + Ye;
  n.firstCreatePass
    ? ((r = Fb(e, n.pipeRegistry)),
      (n.data[i] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy))
    : (r = n.data[i]);
  let o = r.factory || (r.factory = Xn(r.type, !0)),
    s,
    a = qe(b);
  try {
    let l = vs(!1),
      c = o();
    return vs(l), Rb(n, K(), i, c), c;
  } finally {
    qe(a);
  }
}
function Fb(t, e) {
  if (e)
    for (let n = e.length - 1; n >= 0; n--) {
      let r = e[n];
      if (t === r.name) return r;
    }
}
function ta(t, e, n) {
  let r = t + Ye,
    i = K(),
    o = qc(i, r);
  return mm(i, r) ? hm(i, ki(), e, o.transform, n, o) : o.transform(n);
}
function na(t, e, n, r) {
  let i = t + Ye,
    o = K(),
    s = qc(o, i);
  return mm(o, i) ? gm(o, ki(), e, s.transform, n, r, s) : s.transform(n, r);
}
function mm(t, e) {
  return t[z].data[e].pure;
}
function Xe(t, e) {
  return Ys(t, e);
}
var ra = (() => {
  let e = class e {
    log(r) {
      console.log(r);
    }
    warn(r) {
      console.warn(r);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
  let t = e;
  return t;
})();
var Nu = new V(''),
  Hi = new V(''),
  ia = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          Ru || (Lb(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > 'u' ? null : Zone.current.get('TaskTrackingZone');
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                ne.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error('pending async requests below zero');
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb();
            }
          });
        else {
          let r = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(r) ? (clearTimeout(i.timeoutId), !1) : !0,
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s,
            )),
              r();
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: s, updateCb: o });
      }
      whenStable(r, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
          );
        this.addCallback(r, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(ne), x(oa), x(Hi));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  oa = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, i) {
        this._applications.set(r, i);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, i = !0) {
        return Ru?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
    let t = e;
    return t;
  })();
function Lb(t) {
  Ru = t;
}
var Ru;
function $i(t) {
  return !!t && typeof t.then == 'function';
}
function vm(t) {
  return !!t && typeof t.subscribe == 'function';
}
var sa = new V(''),
  ym = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = D(sa, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let o of this.appInits) {
          let s = o();
          if ($i(s)) r.push(s);
          else if (vm(s)) {
            let a = new Promise((l, c) => {
              s.subscribe({ complete: l, error: c });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  aa = new V('');
function kb() {
  Uf(() => {
    throw new v(600, !1);
  });
}
function jb(t) {
  return t.isBoundToModule;
}
function Bb(t, e, n) {
  try {
    let r = n();
    return $i(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
var Xr = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = D(ug)),
        (this.afterRenderEffectManager = D(Cu)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new xe()),
        (this.afterTick = new xe()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = D(ea).hasPendingTasks.pipe(Z((r) => !r))),
        (this._injector = D(Qe));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let o = r instanceof Es;
      if (!this._injector.get(ym).done) {
        let p = !o && Ch(r),
          h = !1;
        throw new v(405, h);
      }
      let a;
      o ? (a = r) : (a = this._injector.get(Zs).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let l = jb(a) ? void 0 : this._injector.get(Tn),
        c = i || a.selector,
        u = a.create(Nn.NULL, [], c, l),
        d = u.location.nativeElement,
        f = u.injector.get(Nu, null);
      return (
        f?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            Bl(this.components, u),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new v(101, !1);
      let i = te(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), te(i);
      }
    }
    detectChangesInAttachedViews(r) {
      let i = 0,
        o = this.afterRenderEffectManager;
      for (;;) {
        if (i === Gg) throw new v(103, !1);
        if (r) {
          let s = i === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: l } of this._views)
            Vb(a, s, l);
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Tc(s),
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Tc(s),
            )))
        )
          break;
      }
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      Bl(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(aa, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => Bl(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Bl(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function Vb(t, e, n) {
  (!e && !Tc(t)) || Ub(t, n, e);
}
function Tc(t) {
  return Kc(t);
}
function Ub(t, e, n) {
  let r;
  n ? ((r = 0), (t[O] |= 1024)) : t[O] & 64 ? (r = 0) : (r = 1), Kg(t, e, r);
}
var Mc = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  la = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new bc(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          o = bh(r),
          s = Eg(o.declarations).reduce((a, l) => {
            let c = In(l);
            return c && a.push(new $r(c)), a;
          }, []);
        return new Mc(i, s);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var Hb = (() => {
  let e = class e {
    constructor() {
      (this.zone = D(ne)), (this.applicationRef = D(Xr));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function $b(t) {
  return [
    { provide: ne, useFactory: t },
    {
      provide: kr,
      multi: !0,
      useFactory: () => {
        let e = D(Hb, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: kr,
      multi: !0,
      useFactory: () => {
        let e = D(Gb);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: ug, useFactory: zb },
  ];
}
function zb() {
  let t = D(ne),
    e = D(Ut);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function Wb(t) {
  let e = $b(() => new ne(qb(t)));
  return Ps([[], e]);
}
function qb(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var Gb = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new Se()),
        (this.initialized = !1),
        (this.zone = D(ne)),
        (this.pendingTasks = D(ea));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ne.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ne.assertInAngularZone(), (r ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Kb() {
  return (typeof $localize < 'u' && $localize.locale) || Ts;
}
var ca = new V('', {
  providedIn: 'root',
  factory: () => D(ca, G.Optional | G.SkipSelf) || Kb(),
});
var wm = new V('');
var cs = null;
function Qb(t = [], e) {
  return Nn.create({
    name: e,
    providers: [
      { provide: Fs, useValue: 'platform' },
      { provide: wm, useValue: new Set([() => (cs = null)]) },
      ...t,
    ],
  });
}
function Yb(t = []) {
  if (cs) return cs;
  let e = Qb(t);
  return (cs = e), kb(), Zb(e), e;
}
function Zb(t) {
  t.get(ru, null)?.forEach((n) => n());
}
var Rn = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = Jb;
  let t = e;
  return t;
})();
function Jb(t) {
  return Xb(ze(), K(), (t & 16) === 16);
}
function Xb(t, e, n) {
  if (ks(t) && !n) {
    let r = An(t.index, e);
    return new ir(r, r);
  } else if (t.type & 47) {
    let r = e[xt];
    return new ir(r, e);
  }
  return null;
}
var Ac = class {
    constructor() {}
    supports(e) {
      return nm(e);
    }
    create(e) {
      return new xc(e);
    }
  },
  e_ = (t, e) => e,
  xc = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || e_);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        o = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < Xp(r, i, o)) ? n : r,
          a = Xp(s, i, o),
          l = s.currentIndex;
        if (s === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            u = l - i;
          if (c != u) {
            for (let f = 0; f < c; f++) {
              let p = f < o.length ? o[f] : (o[f] = 0),
                h = p + f;
              u <= h && h < c && (o[f] = p + 1);
            }
            let d = s.previousIndex;
            o[d] = u - c;
          }
        }
        a !== l && e(s, a, l);
      }
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachMovedItem(e) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    forEachIdentityChange(e) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        e(n);
    }
    diff(e) {
      if ((e == null && (e = []), !nm(e))) throw new v(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, o, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, o, s, a)),
                Object.is(n.item, o) || this._addIdentityChange(n, o)),
            (n = n._next);
      } else
        (i = 0),
          GC(e, (a) => {
            (s = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, i)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(n), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, n, r, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Nc(n, r), o, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let n = e._next;
        this._addToRemovals(this._unlink(e)), (e = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, n, r),
        this._addToMoves(e, r),
        e
      );
    }
    _moveAfter(e, n, r) {
      return (
        this._unlink(e), this._insertAfter(e, n, r), this._addToMoves(e, r), e
      );
    }
    _addAfter(e, n, r) {
      return (
        this._insertAfter(e, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, n, r) {
      let i = n === null ? this._itHead : n._next;
      return (
        (e._next = i),
        (e._prev = n),
        i === null ? (this._itTail = e) : (i._prev = e),
        n === null ? (this._itHead = e) : (n._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Ms()),
        this._linkedRecords.put(e),
        (e.currentIndex = r),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let n = e._prev,
        r = e._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        e
      );
    }
    _addToMoves(e, n) {
      return (
        e.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Ms()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, n) {
      return (
        (e.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Nc = class {
    constructor(e, n) {
      (this.item = e),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Rc = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, e))
          return r;
      return null;
    }
    remove(e) {
      let n = e._prevDup,
        r = e._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  Ms = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new Rc()), this.map.set(n, r)), r.add(e);
    }
    get(e, n) {
      let r = e,
        i = this.map.get(r);
      return i ? i.get(e, n) : null;
    }
    remove(e) {
      let n = e.trackById;
      return this.map.get(n).remove(e) && this.map.delete(n), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Xp(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
var Oc = class {
    constructor() {}
    supports(e) {
      return e instanceof Map || _u(e);
    }
    create() {
      return new Pc();
    }
  },
  Pc = class {
    constructor() {
      (this._records = new Map()),
        (this._mapHead = null),
        (this._appendAfter = null),
        (this._previousMapHead = null),
        (this._changesHead = null),
        (this._changesTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(e) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) e(n);
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachChangedItem(e) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    diff(e) {
      if (!e) e = new Map();
      else if (!(e instanceof Map || _u(e))) throw new v(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(e, (r, i) => {
          if (n && n.key === i)
            this._maybeAddToChanges(n, r),
              (this._appendAfter = n),
              (n = n._next);
          else {
            let o = this._getOrCreateRecordForKey(i, r);
            n = this._insertBeforeOrAppend(n, o);
          }
        }),
        n)
      ) {
        n._prev && (n._prev._next = null), (this._removalsHead = n);
        for (let r = n; r !== null; r = r._nextRemoved)
          r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(e, n) {
      if (e) {
        let r = e._prev;
        return (
          (n._next = e),
          (n._prev = r),
          (e._prev = n),
          r && (r._next = n),
          e === this._mapHead && (this._mapHead = n),
          (this._appendAfter = e),
          e
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(e, n) {
      if (this._records.has(e)) {
        let i = this._records.get(e);
        this._maybeAddToChanges(i, n);
        let o = i._prev,
          s = i._next;
        return (
          o && (o._next = s),
          s && (s._prev = o),
          (i._next = null),
          (i._prev = null),
          i
        );
      }
      let r = new Fc(e);
      return (
        this._records.set(e, r),
        (r.currentValue = n),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (
          this._previousMapHead = this._mapHead, e = this._previousMapHead;
          e !== null;
          e = e._next
        )
          e._nextPrevious = e._next;
        for (e = this._changesHead; e !== null; e = e._nextChanged)
          e.previousValue = e.currentValue;
        for (e = this._additionsHead; e != null; e = e._nextAdded)
          e.previousValue = e.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(e, n) {
      Object.is(n, e.currentValue) ||
        ((e.previousValue = e.currentValue),
        (e.currentValue = n),
        this._addToChanges(e));
    }
    _addToAdditions(e) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = e)
        : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
    }
    _addToChanges(e) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = e)
        : ((this._changesTail._nextChanged = e), (this._changesTail = e));
    }
    _forEach(e, n) {
      e instanceof Map
        ? e.forEach(n)
        : Object.keys(e).forEach((r) => n(e[r], r));
    }
  },
  Fc = class {
    constructor(e) {
      (this.key = e),
        (this.previousValue = null),
        (this.currentValue = null),
        (this._nextPrevious = null),
        (this._next = null),
        (this._prev = null),
        (this._nextAdded = null),
        (this._nextRemoved = null),
        (this._nextChanged = null);
    }
  };
function eh() {
  return new Ou([new Ac()]);
}
var Ou = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let o = i.factories.slice();
        r = r.concat(o);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || eh()),
        deps: [[e, new Rs(), new Pi()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i != null) return i;
      throw new v(901, !1);
    }
  };
  e.ɵprov = I({ token: e, providedIn: 'root', factory: eh });
  let t = e;
  return t;
})();
function th() {
  return new Pu([new Oc()]);
}
var Pu = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i) {
        let o = i.factories.slice();
        r = r.concat(o);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || th()),
        deps: [[e, new Rs(), new Pi()]],
      };
    }
    find(r) {
      let i = this.factories.find((o) => o.supports(r));
      if (i) return i;
      throw new v(901, !1);
    }
  };
  e.ɵprov = I({ token: e, providedIn: 'root', factory: th });
  let t = e;
  return t;
})();
var Dm = (() => {
  let e = class e {
    constructor(r) {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(Xr));
  }),
    (e.ɵmod = Ie({ type: e })),
    (e.ɵinj = _e({}));
  let t = e;
  return t;
})();
function Em(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = Yb(r),
      o = [Wb(), ...(n || [])],
      a = new _s({
        providers: o,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      l = a.get(ne);
    return l.run(() => {
      a.resolveInjectorInitializers();
      let c = a.get(Ut, null),
        u;
      l.runOutsideAngular(() => {
        u = l.onError.subscribe({
          next: (p) => {
            c.handleError(p);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get(wm);
      return (
        f.add(d),
        a.onDestroy(() => {
          u.unsubscribe(), f.delete(d);
        }),
        Bb(c, l, () => {
          let p = a.get(ym);
          return (
            p.runInitializers(),
            p.donePromise.then(() => {
              let h = a.get(ca, Ts);
              Ab(h || Ts);
              let g = a.get(Xr);
              return e !== void 0 && g.bootstrap(e), g;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function re(t) {
  return typeof t == 'boolean' ? t : t != null && t !== 'false';
}
function zi(t, e = NaN) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t)) ? Number(t) : e;
}
function Cm(t) {
  let e = In(t);
  if (!e) return null;
  let n = new $r(e);
  return {
    get selector() {
      return n.selector;
    },
    get type() {
      return n.componentType;
    },
    get inputs() {
      return n.inputs;
    },
    get outputs() {
      return n.outputs;
    },
    get ngContentSelectors() {
      return n.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var xm = null;
function ur() {
  return xm;
}
function Nm(t) {
  xm ??= t;
}
var ua = class {};
var de = new V(''),
  Hu = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error('');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(t_), providedIn: 'platform' }));
    let t = e;
    return t;
  })(),
  Rm = new V(''),
  t_ = (() => {
    let e = class e extends Hu {
      constructor() {
        super(),
          (this._doc = D(de)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return ur().getBaseHref(this._doc);
      }
      onPopState(r) {
        let i = ur().getGlobalEventTarget(this._doc, 'window');
        return (
          i.addEventListener('popstate', r, !1),
          () => i.removeEventListener('popstate', r)
        );
      }
      onHashChange(r) {
        let i = ur().getGlobalEventTarget(this._doc, 'window');
        return (
          i.addEventListener('hashchange', r, !1),
          () => i.removeEventListener('hashchange', r)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(r) {
        this._location.pathname = r;
      }
      pushState(r, i, o) {
        this._history.pushState(r, i, o);
      }
      replaceState(r, i, o) {
        this._history.replaceState(r, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(r = 0) {
        this._history.go(r);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({
        token: e,
        factory: () => new e(),
        providedIn: 'platform',
      }));
    let t = e;
    return t;
  })();
function $u(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith('/') && n++,
    e.startsWith('/') && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + '/' + e
  );
}
function bm(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === '/' ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function dn(t) {
  return t && t[0] !== '?' ? '?' + t : t;
}
var pn = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error('');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(zu), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Om = new V(''),
  zu = (() => {
    let e = class e extends pn {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            D(de).location?.origin ??
            '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return $u(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + dn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && r ? `${i}${o}` : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + dn(s));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + dn(s));
        this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Hu), x(Om, 8));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Pm = (() => {
    let e = class e extends pn {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._baseHref = ''),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(r = !1) {
        let i = this._platformLocation.hash ?? '#';
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(r) {
        let i = $u(this._baseHref, r);
        return i.length > 0 ? '#' + i : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + dn(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + dn(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Hu), x(Om, 8));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ei = (() => {
    let e = class e {
      constructor(r) {
        (this._subject = new Ce()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = r);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = i_(bm(_m(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(r = !1) {
        return this.normalize(this._locationStrategy.path(r));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(r, i = '') {
        return this.path() == this.normalize(r + dn(i));
      }
      normalize(r) {
        return e.stripTrailingSlash(r_(this._basePath, _m(r)));
      }
      prepareExternalUrl(r) {
        return (
          r && r[0] !== '/' && (r = '/' + r),
          this._locationStrategy.prepareExternalUrl(r)
        );
      }
      go(r, i = '', o = null) {
        this._locationStrategy.pushState(o, '', r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + dn(i)), o);
      }
      replaceState(r, i = '', o = null) {
        this._locationStrategy.replaceState(o, '', r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + dn(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(r = 0) {
        this._locationStrategy.historyGo?.(r);
      }
      onUrlChange(r) {
        return (
          this._urlChangeListeners.push(r),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(r);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(r = '', i) {
        this._urlChangeListeners.forEach((o) => o(r, i));
      }
      subscribe(r, i, o) {
        return this._subject.subscribe({ next: r, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = dn),
      (e.joinWithSlash = $u),
      (e.stripTrailingSlash = bm),
      (e.ɵfac = function (i) {
        return new (i || e)(x(pn));
      }),
      (e.ɵprov = I({ token: e, factory: () => n_(), providedIn: 'root' }));
    let t = e;
    return t;
  })();
function n_() {
  return new ei(x(pn));
}
function r_(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === '' || ['/', ';', '?', '#'].includes(n[0]) ? n : e;
}
function _m(t) {
  return t.replace(/\/index.html$/, '');
}
function i_(t) {
  if (new RegExp('^(https?:)?//').test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
var Fm = (function (t) {
  return (
    (t[(t.Decimal = 0)] = 'Decimal'),
    (t[(t.Percent = 1)] = 'Percent'),
    (t[(t.Currency = 2)] = 'Currency'),
    (t[(t.Scientific = 3)] = 'Scientific'),
    t
  );
})(Fm || {});
var fn = {
  Decimal: 0,
  Group: 1,
  List: 2,
  PercentSign: 3,
  PlusSign: 4,
  MinusSign: 5,
  Exponential: 6,
  SuperscriptingExponent: 7,
  PerMille: 8,
  Infinity: 9,
  NaN: 10,
  TimeSeparator: 11,
  CurrencyDecimal: 12,
  CurrencyGroup: 13,
};
function Wi(t, e) {
  let n = Tu(t),
    r = n[Zr.NumberSymbols][e];
  if (typeof r > 'u') {
    if (e === fn.CurrencyDecimal) return n[Zr.NumberSymbols][fn.Decimal];
    if (e === fn.CurrencyGroup) return n[Zr.NumberSymbols][fn.Group];
  }
  return r;
}
function o_(t, e) {
  return Tu(t)[Zr.NumberFormats][e];
}
var s_ = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
  Im = 22,
  da = '.',
  qi = '0',
  a_ = ';',
  l_ = ',',
  Fu = '#';
function c_(t, e, n, r, i, o, s = !1) {
  let a = '',
    l = !1;
  if (!isFinite(t)) a = Wi(n, fn.Infinity);
  else {
    let c = p_(t);
    s && (c = f_(c));
    let u = e.minInt,
      d = e.minFrac,
      f = e.maxFrac;
    if (o) {
      let $ = o.match(s_);
      if ($ === null) throw new Error(`${o} is not a valid digit info`);
      let J = $[1],
        ee = $[3],
        Ve = $[5];
      J != null && (u = Lu(J)),
        ee != null && (d = Lu(ee)),
        Ve != null ? (f = Lu(Ve)) : ee != null && d > f && (f = d);
    }
    h_(c, d, f);
    let p = c.digits,
      h = c.integerLen,
      g = c.exponent,
      M = [];
    for (l = p.every(($) => !$); h < u; h++) p.unshift(0);
    for (; h < 0; h++) p.unshift(0);
    h > 0 ? (M = p.splice(h, p.length)) : ((M = p), (p = [0]));
    let A = [];
    for (
      p.length >= e.lgSize && A.unshift(p.splice(-e.lgSize, p.length).join(''));
      p.length > e.gSize;

    )
      A.unshift(p.splice(-e.gSize, p.length).join(''));
    p.length && A.unshift(p.join('')),
      (a = A.join(Wi(n, r))),
      M.length && (a += Wi(n, i) + M.join('')),
      g && (a += Wi(n, fn.Exponential) + '+' + g);
  }
  return (
    t < 0 && !l ? (a = e.negPre + a + e.negSuf) : (a = e.posPre + a + e.posSuf),
    a
  );
}
function u_(t, e, n) {
  let r = o_(e, Fm.Decimal),
    i = d_(r, Wi(e, fn.MinusSign));
  return c_(t, i, e, fn.Group, fn.Decimal, n);
}
function d_(t, e = '-') {
  let n = {
      minInt: 1,
      minFrac: 0,
      maxFrac: 0,
      posPre: '',
      posSuf: '',
      negPre: '',
      negSuf: '',
      gSize: 0,
      lgSize: 0,
    },
    r = t.split(a_),
    i = r[0],
    o = r[1],
    s =
      i.indexOf(da) !== -1
        ? i.split(da)
        : [
            i.substring(0, i.lastIndexOf(qi) + 1),
            i.substring(i.lastIndexOf(qi) + 1),
          ],
    a = s[0],
    l = s[1] || '';
  n.posPre = a.substring(0, a.indexOf(Fu));
  for (let u = 0; u < l.length; u++) {
    let d = l.charAt(u);
    d === qi
      ? (n.minFrac = n.maxFrac = u + 1)
      : d === Fu
        ? (n.maxFrac = u + 1)
        : (n.posSuf += d);
  }
  let c = a.split(l_);
  if (
    ((n.gSize = c[1] ? c[1].length : 0),
    (n.lgSize = c[2] || c[1] ? (c[2] || c[1]).length : 0),
    o)
  ) {
    let u = i.length - n.posPre.length - n.posSuf.length,
      d = o.indexOf(Fu);
    (n.negPre = o.substring(0, d).replace(/'/g, '')),
      (n.negSuf = o.slice(d + u).replace(/'/g, ''));
  } else (n.negPre = e + n.posPre), (n.negSuf = n.posSuf);
  return n;
}
function f_(t) {
  if (t.digits[0] === 0) return t;
  let e = t.digits.length - t.integerLen;
  return (
    t.exponent
      ? (t.exponent += 2)
      : (e === 0 ? t.digits.push(0, 0) : e === 1 && t.digits.push(0),
        (t.integerLen += 2)),
    t
  );
}
function p_(t) {
  let e = Math.abs(t) + '',
    n = 0,
    r,
    i,
    o,
    s,
    a;
  for (
    (i = e.indexOf(da)) > -1 && (e = e.replace(da, '')),
      (o = e.search(/e/i)) > 0
        ? (i < 0 && (i = o), (i += +e.slice(o + 1)), (e = e.substring(0, o)))
        : i < 0 && (i = e.length),
      o = 0;
    e.charAt(o) === qi;
    o++
  );
  if (o === (a = e.length)) (r = [0]), (i = 1);
  else {
    for (a--; e.charAt(a) === qi; ) a--;
    for (i -= o, r = [], s = 0; o <= a; o++, s++) r[s] = Number(e.charAt(o));
  }
  return (
    i > Im && ((r = r.splice(0, Im - 1)), (n = i - 1), (i = 1)),
    { digits: r, exponent: n, integerLen: i }
  );
}
function h_(t, e, n) {
  if (e > n)
    throw new Error(
      `The minimum number of digits after fraction (${e}) is higher than the maximum (${n}).`,
    );
  let r = t.digits,
    i = r.length - t.integerLen,
    o = Math.min(Math.max(e, i), n),
    s = o + t.integerLen,
    a = r[s];
  if (s > 0) {
    r.splice(Math.max(t.integerLen, s));
    for (let d = s; d < r.length; d++) r[d] = 0;
  } else {
    (i = Math.max(0, i)),
      (t.integerLen = 1),
      (r.length = Math.max(1, (s = o + 1))),
      (r[0] = 0);
    for (let d = 1; d < s; d++) r[d] = 0;
  }
  if (a >= 5)
    if (s - 1 < 0) {
      for (let d = 0; d > s; d--) r.unshift(0), t.integerLen++;
      r.unshift(1), t.integerLen++;
    } else r[s - 1]++;
  for (; i < Math.max(0, o); i++) r.push(0);
  let l = o !== 0,
    c = e + t.integerLen,
    u = r.reduceRight(function (d, f, p, h) {
      return (
        (f = f + d),
        (h[p] = f < 10 ? f : f - 10),
        l && (h[p] === 0 && p >= c ? h.pop() : (l = !1)),
        f >= 10 ? 1 : 0
      );
    }, 0);
  u && (r.unshift(u), t.integerLen++);
}
function Lu(t) {
  let e = parseInt(t);
  if (isNaN(e)) throw new Error('Invalid integer literal when parsing ' + t);
  return e;
}
function Lm(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(';')) {
    let r = n.indexOf('='),
      [i, o] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var ku = /\s+/,
  Sm = [],
  On = (() => {
    let e = class e {
      constructor(r, i) {
        (this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = Sm),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(ku) : Sm;
      }
      set ngClass(r) {
        this.rawClass = typeof r == 'string' ? r.trim().split(ku) : r;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let r = this.rawClass;
        if (Array.isArray(r) || r instanceof Set)
          for (let i of r) this._updateState(i, !0);
        else if (r != null)
          for (let i of Object.keys(r)) this._updateState(i, !!r[i]);
        this._applyStateDiff();
      }
      _updateState(r, i) {
        let o = this.stateMap.get(r);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            o = r[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(r, i) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(ku).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(we), b(Nt));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'ngClass', '']],
        inputs: { klass: [j.None, 'class', 'klass'], ngClass: 'ngClass' },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var ju = class {
    constructor(e, n, r, i) {
      (this.$implicit = e),
        (this.ngForOf = n),
        (this.index = r),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  He = (() => {
    let e = class e {
      set ngForOf(r) {
        (this._ngForOf = r), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(r) {
        this._trackByFn = r;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(r, i, o) {
        (this._viewContainer = r),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(r) {
        r && (this._template = r);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let r = this._ngForOf;
          if (!this._differ && r)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(r).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let r = this._differ.diff(this._ngForOf);
          r && this._applyChanges(r);
        }
      }
      _applyChanges(r) {
        let i = this._viewContainer;
        r.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new ju(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a,
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let l = i.get(s);
            i.move(l, a), Tm(l, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let l = i.get(o).context;
          (l.index = o), (l.count = s), (l.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          Tm(s, o);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(un), b(on), b(Ou));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'ngFor', '', 'ngForOf', '']],
        inputs: {
          ngForOf: 'ngForOf',
          ngForTrackBy: 'ngForTrackBy',
          ngForTemplate: 'ngForTemplate',
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function Tm(t, e) {
  t.context.$implicit = e.item;
}
var De = (() => {
    let e = class e {
      constructor(r, i) {
        (this._viewContainer = r),
          (this._context = new Bu()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(r) {
        (this._context.$implicit = this._context.ngIf = r), this._updateView();
      }
      set ngIfThen(r) {
        Mm('ngIfThen', r),
          (this._thenTemplateRef = r),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(r) {
        Mm('ngIfElse', r),
          (this._elseTemplateRef = r),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(un), b(on));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'ngIf', '']],
        inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Bu = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Mm(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${Ke(e)}'.`);
}
var Pn = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._ngEl = r),
          (this._differs = i),
          (this._renderer = o),
          (this._ngStyle = null),
          (this._differ = null);
      }
      set ngStyle(r) {
        (this._ngStyle = r),
          !this._differ && r && (this._differ = this._differs.find(r).create());
      }
      ngDoCheck() {
        if (this._differ) {
          let r = this._differ.diff(this._ngStyle);
          r && this._applyChanges(r);
        }
      }
      _setStyle(r, i) {
        let [o, s] = r.split('.'),
          a = o.indexOf('-') === -1 ? void 0 : Ht.DashCase;
        i != null
          ? this._renderer.setStyle(
              this._ngEl.nativeElement,
              o,
              s ? `${i}${s}` : i,
              a,
            )
          : this._renderer.removeStyle(this._ngEl.nativeElement, o, a);
      }
      _applyChanges(r) {
        r.forEachRemovedItem((i) => this._setStyle(i.key, null)),
          r.forEachAddedItem((i) => this._setStyle(i.key, i.currentValue)),
          r.forEachChangedItem((i) => this._setStyle(i.key, i.currentValue));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(we), b(Pu), b(Nt));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'ngStyle', '']],
        inputs: { ngStyle: 'ngStyle' },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  ti = (() => {
    let e = class e {
      constructor(r) {
        (this._viewContainerRef = r),
          (this._viewRef = null),
          (this.ngTemplateOutletContext = null),
          (this.ngTemplateOutlet = null),
          (this.ngTemplateOutletInjector = null);
      }
      ngOnChanges(r) {
        if (this._shouldRecreateView(r)) {
          let i = this._viewContainerRef;
          if (
            (this._viewRef && i.remove(i.indexOf(this._viewRef)),
            !this.ngTemplateOutlet)
          ) {
            this._viewRef = null;
            return;
          }
          let o = this._createContextForwardProxy();
          this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, o, {
            injector: this.ngTemplateOutletInjector ?? void 0,
          });
        }
      }
      _shouldRecreateView(r) {
        return !!r.ngTemplateOutlet || !!r.ngTemplateOutletInjector;
      }
      _createContextForwardProxy() {
        return new Proxy(
          {},
          {
            set: (r, i, o) =>
              this.ngTemplateOutletContext
                ? Reflect.set(this.ngTemplateOutletContext, i, o)
                : !1,
            get: (r, i, o) => {
              if (this.ngTemplateOutletContext)
                return Reflect.get(this.ngTemplateOutletContext, i, o);
            },
          },
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(un));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'ngTemplateOutlet', '']],
        inputs: {
          ngTemplateOutletContext: 'ngTemplateOutletContext',
          ngTemplateOutlet: 'ngTemplateOutlet',
          ngTemplateOutletInjector: 'ngTemplateOutletInjector',
        },
        standalone: !0,
        features: [ar],
      }));
    let t = e;
    return t;
  })();
function g_(t, e) {
  return new v(2100, !1);
}
var pa = (() => {
  let e = class e {
    constructor(r) {
      this._locale = r;
    }
    transform(r, i, o) {
      if (!m_(r)) return null;
      o ||= this._locale;
      try {
        let s = v_(r);
        return u_(s, o, i);
      } catch (s) {
        throw g_(e, s.message);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(ca, 16));
  }),
    (e.ɵpipe = Os({ name: 'number', type: e, pure: !0, standalone: !0 }));
  let t = e;
  return t;
})();
function m_(t) {
  return !(t == null || t === '' || t !== t);
}
function v_(t) {
  if (typeof t == 'string' && !isNaN(Number(t) - parseFloat(t)))
    return Number(t);
  if (typeof t != 'number') throw new Error(`${t} is not a number`);
  return t;
}
var le = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = _e({}));
    let t = e;
    return t;
  })(),
  Wu = 'browser',
  y_ = 'server';
function Gi(t) {
  return t === Wu;
}
function qu(t) {
  return t === y_;
}
var km = (() => {
    let e = class e {};
    e.ɵprov = I({
      token: e,
      providedIn: 'root',
      factory: () => (Gi(D(wt)) ? new Vu(D(de), window) : new Uu()),
    });
    let t = e;
    return t;
  })(),
  Vu = class {
    constructor(e, n) {
      (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let n = w_(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(r - o[0], i - o[1]);
    }
  };
function w_(t, e) {
  let n = t.getElementById(e) || t.getElementsByName(e)[0];
  if (n) return n;
  if (
    typeof t.createTreeWalker == 'function' &&
    t.body &&
    typeof t.body.attachShadow == 'function'
  ) {
    let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var Uu = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  fa = class {};
var Qu = class extends ua {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Yu = class t extends Qu {
    static makeCurrent() {
      Nm(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === 'window'
        ? window
        : n === 'document'
          ? e
          : n === 'body'
            ? e.body
            : null;
    }
    getBaseHref(e) {
      let n = D_();
      return n == null ? null : E_(n);
    }
    resetBaseElement() {
      Ki = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Lm(document.cookie, e);
    }
  },
  Ki = null;
function D_() {
  return (
    (Ki = Ki || document.querySelector('base')),
    Ki ? Ki.getAttribute('href') : null
  );
}
function E_(t) {
  return new URL(t, document.baseURI).pathname;
}
var Zu = class {
    addToWindow(e) {
      (Re.getAngularTestability = (r, i = !0) => {
        let o = e.findTestabilityInTree(r, i);
        if (o == null) throw new v(5103, !1);
        return o;
      }),
        (Re.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (Re.getAllAngularRootElements = () => e.getAllRootElements());
      let n = (r) => {
        let i = Re.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && r();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      Re.frameworkStabilizers || (Re.frameworkStabilizers = []),
        Re.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(e, n, r) {
      if (n == null) return null;
      let i = e.getTestability(n);
      return (
        i ??
        (r
          ? ur().isShadowRoot(n)
            ? this.findTestabilityInTree(e, n.host, !0)
            : this.findTestabilityInTree(e, n.parentElement, !0)
          : null)
      );
    }
  },
  C_ = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ju = new V(''),
  Vm = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, o) {
        return this._findPluginFor(i).addEventListener(r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(r))), !i))
          throw new v(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Ju), x(ne));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ha = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Gu = 'ng-app-id',
  Um = (() => {
    let e = class e {
      constructor(r, i, o, s = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = qu(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((o) => o.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Gu}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let o = this.styleRef;
        if (o.has(r)) {
          let s = o.get(r);
          return (s.usage += i), s.usage;
        }
        return o.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(Gu), s;
        {
          let a = this.doc.createElement('style');
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Gu, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let o = this.getStyleElement(r, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(de), x(zs), x(ou, 8), x(wt));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ku = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  ed = /%COMP%/g,
  Hm = '%COMP%',
  b_ = `_nghost-${Hm}`,
  __ = `_ngcontent-${Hm}`,
  I_ = !0,
  S_ = new V('', { providedIn: 'root', factory: () => I_ });
function T_(t) {
  return __.replace(ed, t);
}
function M_(t) {
  return b_.replace(ed, t);
}
function $m(t, e) {
  return e.map((n) => n.replace(ed, t));
}
var ga = (() => {
    let e = class e {
      constructor(r, i, o, s, a, l, c, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = l),
          (this.ngZone = c),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = qu(l)),
          (this.defaultRenderer = new Qi(r, a, c, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === Bt.ShadowDom &&
          (i = Ee(C({}, i), { encapsulation: Bt.Emulated }));
        let o = this.getOrCreateRenderer(r, i);
        return (
          o instanceof ma
            ? o.applyToHost(r)
            : o instanceof Yi && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(r, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            l = this.ngZone,
            c = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case Bt.Emulated:
              s = new ma(c, u, i, this.appId, d, a, l, f);
              break;
            case Bt.ShadowDom:
              return new Xu(c, u, r, i, a, l, this.nonce, f);
            default:
              s = new Yi(c, u, i, d, a, l, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        x(Vm),
        x(Um),
        x(zs),
        x(S_),
        x(de),
        x(wt),
        x(ne),
        x(ou),
      );
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Qi = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(Ku[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (jm(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (jm(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == 'string' ? this.doc.querySelector(e) : e;
      if (!r) throw new v(-5104, !1);
      return n || (r.textContent = ''), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ':' + n;
        let o = Ku[i];
        o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Ku[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (Ht.DashCase | Ht.Important)
        ? e.style.setProperty(n, r, i & Ht.Important ? 'important' : '')
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & Ht.DashCase ? e.style.removeProperty(n) : (e.style[n] = '');
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == 'string' &&
        ((e = ur().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r),
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === '__ngUnwrap__') return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function jm(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var Xu = class extends Qi {
    constructor(e, n, r, i, o, s, a, l) {
      super(e, o, s, l),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = $m(i.id, i.styles);
      for (let u of c) {
        let d = document.createElement('style');
        a && d.setAttribute('nonce', a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Yi = class extends Qi {
    constructor(e, n, r, i, o, s, a, l) {
      super(e, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = l ? $m(l, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ma = class extends Yi {
    constructor(e, n, r, i, o, s, a, l) {
      let c = i + '-' + r.id;
      super(e, n, r, o, s, a, l, c),
        (this.contentAttr = T_(c)),
        (this.hostAttr = M_(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '');
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ''), r;
    }
  },
  A_ = (() => {
    let e = class e extends ha {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, o) {
        return (
          r.addEventListener(i, o, !1), () => this.removeEventListener(r, i, o)
        );
      }
      removeEventListener(r, i, o) {
        return r.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(de));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Bm = ['alt', 'control', 'meta', 'shift'],
  x_ = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  N_ = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  R_ = (() => {
    let e = class e extends ha {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => ur().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split('.'),
          o = i.shift();
        if (i.length === 0 || !(o === 'keydown' || o === 'keyup')) return null;
        let s = e._normalizeKey(i.pop()),
          a = '',
          l = i.indexOf('code');
        if (
          (l > -1 && (i.splice(l, 1), (a = 'code.')),
          Bm.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + '.'));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(r, i) {
        let o = x_[r.key] || r.key,
          s = '';
        return (
          i.indexOf('code.') > -1 && ((o = r.code), (s = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              Bm.forEach((a) => {
                if (a !== o) {
                  let l = N_[a];
                  l(r) && (s += a + '.');
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(r, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, r) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(r) {
        return r === 'esc' ? 'escape' : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(de));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function zm(t, e) {
  return Em(C({ rootComponent: t }, O_(e)));
}
function O_(t) {
  return {
    appProviders: [...Wm, ...(t?.providers ?? [])],
    platformProviders: k_,
  };
}
function P_() {
  Yu.makeCurrent();
}
function F_() {
  return new Ut();
}
function L_() {
  return mg(document), document;
}
var k_ = [
  { provide: wt, useValue: Wu },
  { provide: ru, useValue: P_, multi: !0 },
  { provide: de, useFactory: L_, deps: [] },
];
var j_ = new V(''),
  B_ = [
    { provide: Hi, useClass: Zu, deps: [] },
    { provide: Nu, useClass: ia, deps: [ne, oa, Hi] },
    { provide: ia, useClass: ia, deps: [ne, oa, Hi] },
  ],
  Wm = [
    { provide: Fs, useValue: 'root' },
    { provide: Ut, useFactory: F_, deps: [] },
    { provide: Ju, useClass: A_, multi: !0, deps: [de, ne, wt] },
    { provide: Ju, useClass: R_, multi: !0, deps: [de] },
    ga,
    Um,
    Vm,
    { provide: or, useExisting: ga },
    { provide: fa, useClass: C_, deps: [] },
    [],
  ],
  qm = (() => {
    let e = class e {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: e, providers: [{ provide: zs, useValue: r.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(j_, 12));
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = _e({ providers: [...Wm, ...B_], imports: [le, Dm] }));
    let t = e;
    return t;
  })();
var Gm = (() => {
  let e = class e {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || '';
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(de));
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var H = 'primary',
  po = Symbol('RouteTitle'),
  od = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function si(t) {
  return new od(t);
}
function U_(t, e, n) {
  let r = n.path.split('/');
  if (
    r.length > t.length ||
    (n.pathMatch === 'full' && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < r.length; o++) {
    let s = r[o],
      a = t[o];
    if (s.startsWith(':')) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function H_(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!Qt(t[n], e[n])) return !1;
  return !0;
}
function Qt(t, e) {
  let n = t ? sd(t) : void 0,
    r = e ? sd(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let o = 0; o < n.length; o++)
    if (((i = n[o]), !nv(t[i], e[i]))) return !1;
  return !0;
}
function sd(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function nv(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, o) => r[o] === i);
  } else return t === e;
}
function rv(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Bn(t) {
  return Dl(t) ? t : $i(t) ? ve(Promise.resolve(t)) : R(t);
}
var $_ = { exact: ov, subset: sv },
  iv = { exact: z_, subset: W_, ignored: () => !0 };
function Km(t, e, n) {
  return (
    $_[n.paths](t.root, e.root, n.matrixParams) &&
    iv[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === 'exact' && t.fragment !== e.fragment)
  );
}
function z_(t, e) {
  return Qt(t, e);
}
function ov(t, e, n) {
  if (
    !fr(t.segments, e.segments) ||
    !wa(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !ov(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function W_(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => nv(t[n], e[n]))
  );
}
function sv(t, e, n) {
  return av(t, e, e.segments, n);
}
function av(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!fr(i, n) || e.hasChildren() || !wa(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!fr(t.segments, n) || !wa(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !sv(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      o = n.slice(t.segments.length);
    return !fr(t.segments, i) || !wa(t.segments, i, r) || !t.children[H]
      ? !1
      : av(t.children[H], e, o, r);
  }
}
function wa(t, e, n) {
  return e.every((r, i) => iv[n](t[i].parameters, r.parameters));
}
var Fn = class {
    constructor(e = new se([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= si(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return K_.serialize(this);
    }
  },
  se = class {
    constructor(e, n) {
      (this.segments = e),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Da(this);
    }
  },
  dr = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= si(this.parameters)), this._parameterMap;
    }
    toString() {
      return cv(this);
    }
  };
function q_(t, e) {
  return fr(t, e) && t.every((n, r) => Qt(n.parameters, e[r].parameters));
}
function fr(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function G_(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === H && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== H && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var ho = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => new ro(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  ro = class {
    parse(e) {
      let n = new ld(e);
      return new Fn(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(e) {
      let n = `/${Zi(e.root, !0)}`,
        r = Z_(e.queryParams),
        i = typeof e.fragment == 'string' ? `#${Q_(e.fragment)}` : '';
      return `${n}${r}${i}`;
    }
  },
  K_ = new ro();
function Da(t) {
  return t.segments.map((e) => cv(e)).join('/');
}
function Zi(t, e) {
  if (!t.hasChildren()) return Da(t);
  if (e) {
    let n = t.children[H] ? Zi(t.children[H], !1) : '',
      r = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== H && r.push(`${i}:${Zi(o, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join('//')})` : n
    );
  } else {
    let n = G_(t, (r, i) =>
      i === H ? [Zi(t.children[H], !1)] : [`${i}:${Zi(r, !1)}`],
    );
    return Object.keys(t.children).length === 1 && t.children[H] != null
      ? `${Da(t)}/${n[0]}`
      : `${Da(t)}/(${n.join('//')})`;
  }
}
function lv(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function va(t) {
  return lv(t).replace(/%3B/gi, ';');
}
function Q_(t) {
  return encodeURI(t);
}
function ad(t) {
  return lv(t)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/%26/gi, '&');
}
function Ea(t) {
  return decodeURIComponent(t);
}
function Qm(t) {
  return Ea(t.replace(/\+/g, '%20'));
}
function cv(t) {
  return `${ad(t.path)}${Y_(t.parameters)}`;
}
function Y_(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${ad(e)}=${ad(n)}`)
    .join('');
}
function Z_(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${va(n)}=${va(i)}`).join('&')
        : `${va(n)}=${va(r)}`,
    )
    .filter((n) => n);
  return e.length ? `?${e.join('&')}` : '';
}
var J_ = /^[^\/()?;#]+/;
function td(t) {
  let e = t.match(J_);
  return e ? e[0] : '';
}
var X_ = /^[^\/()?;=#]+/;
function eI(t) {
  let e = t.match(X_);
  return e ? e[0] : '';
}
var tI = /^[^=?&#]+/;
function nI(t) {
  let e = t.match(tI);
  return e ? e[0] : '';
}
var rI = /^[^&#]+/;
function iI(t) {
  let e = t.match(rI);
  return e ? e[0] : '';
}
var ld = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' ||
      this.peekStartsWith('?') ||
      this.peekStartsWith('#')
        ? new se([], {})
        : new se([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(e);
      while (this.consumeOptional('&'));
    return e;
  }
  parseFragment() {
    return this.consumeOptional('#')
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let e = [];
    for (
      this.peekStartsWith('(') || e.push(this.parseSegment());
      this.peekStartsWith('/') &&
      !this.peekStartsWith('//') &&
      !this.peekStartsWith('/(');

    )
      this.capture('/'), e.push(this.parseSegment());
    let n = {};
    this.peekStartsWith('/(') &&
      (this.capture('/'), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith('(') && (r = this.parseParens(!1)),
      (e.length > 0 || Object.keys(n).length > 0) && (r[H] = new se(e, n)),
      r
    );
  }
  parseSegment() {
    let e = td(this.remaining);
    if (e === '' && this.peekStartsWith(';')) throw new v(4009, !1);
    return this.capture(e), new dr(Ea(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(';'); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = eI(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = '';
    if (this.consumeOptional('=')) {
      let i = td(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Ea(n)] = Ea(r);
  }
  parseQueryParam(e) {
    let n = nI(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = '';
    if (this.consumeOptional('=')) {
      let s = iI(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let i = Qm(n),
      o = Qm(r);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture('(');
      !this.consumeOptional(')') && this.remaining.length > 0;

    ) {
      let r = td(this.remaining),
        i = this.remaining[r.length];
      if (i !== '/' && i !== ')' && i !== ';') throw new v(4010, !1);
      let o;
      r.indexOf(':') > -1
        ? ((o = r.slice(0, r.indexOf(':'))), this.capture(o), this.capture(':'))
        : e && (o = H);
      let s = this.parseChildren();
      (n[o] = Object.keys(s).length === 1 ? s[H] : new se([], s)),
        this.consumeOptional('//');
    }
    return n;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new v(4011, !1);
  }
};
function uv(t) {
  return t.segments.length > 0 ? new se([], { [H]: t }) : t;
}
function dv(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let o = dv(i);
    if (r === H && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
  }
  let n = new se(t.segments, e);
  return oI(n);
}
function oI(t) {
  if (t.numberOfChildren === 1 && t.children[H]) {
    let e = t.children[H];
    return new se(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function ai(t) {
  return t instanceof Fn;
}
function sI(t, e, n = null, r = null) {
  let i = fv(t);
  return pv(i, e, n, r);
}
function fv(t) {
  let e;
  function n(o) {
    let s = {};
    for (let l of o.children) {
      let c = n(l);
      s[l.outlet] = c;
    }
    let a = new se(o.url, s);
    return o === t && (e = a), a;
  }
  let r = n(t.root),
    i = uv(r);
  return e ?? i;
}
function pv(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return nd(i, i, i, n, r);
  let o = aI(e);
  if (o.toRoot()) return nd(i, i, new se([], {}), n, r);
  let s = lI(o, i, t),
    a = s.processChildren
      ? eo(s.segmentGroup, s.index, o.commands)
      : gv(s.segmentGroup, s.index, o.commands);
  return nd(i, s.segmentGroup, a, n, r);
}
function Ca(t) {
  return typeof t == 'object' && t != null && !t.outlets && !t.segmentPath;
}
function io(t) {
  return typeof t == 'object' && t != null && t.outlets;
}
function nd(t, e, n, r, i) {
  let o = {};
  r &&
    Object.entries(r).forEach(([l, c]) => {
      o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
    });
  let s;
  t === e ? (s = n) : (s = hv(t, e, n));
  let a = uv(dv(s));
  return new Fn(a, o, i);
}
function hv(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (r[i] = n) : (r[i] = hv(o, e, n));
    }),
    new se(t.segments, r)
  );
}
var ba = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && Ca(r[0]))
    )
      throw new v(4003, !1);
    let i = r.find(io);
    if (i && i !== rv(r)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/'
    );
  }
};
function aI(t) {
  if (typeof t[0] == 'string' && t.length === 1 && t[0] === '/')
    return new ba(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, o, s) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([l, c]) => {
              a[l] = typeof c == 'string' ? c.split('/') : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != 'string'
        ? [...i, o]
        : s === 0
          ? (o.split('/').forEach((a, l) => {
              (l == 0 && a === '.') ||
                (l == 0 && a === ''
                  ? (n = !0)
                  : a === '..'
                    ? e++
                    : a != '' && i.push(a));
            }),
            i)
          : [...i, o];
    }, []);
  return new ba(n, e, r);
}
var ii = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function lI(t, e, n) {
  if (t.isAbsolute) return new ii(e, !0, 0);
  if (!n) return new ii(e, !1, NaN);
  if (n.parent === null) return new ii(n, !0, 0);
  let r = Ca(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return cI(n, i, t.numberOfDoubleDots);
}
function cI(t, e, n) {
  let r = t,
    i = e,
    o = n;
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new v(4005, !1);
    i = r.segments.length;
  }
  return new ii(r, !1, i - o);
}
function uI(t) {
  return io(t[0]) ? t[0].outlets : { [H]: t };
}
function gv(t, e, n) {
  if (((t ??= new se([], {})), t.segments.length === 0 && t.hasChildren()))
    return eo(t, e, n);
  let r = dI(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let o = new se(t.segments.slice(0, r.pathIndex), {});
    return (
      (o.children[H] = new se(t.segments.slice(r.pathIndex), t.children)),
      eo(o, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new se(t.segments, {})
      : r.match && !t.hasChildren()
        ? cd(t, e, n)
        : r.match
          ? eo(t, 0, i)
          : cd(t, e, n);
}
function eo(t, e, n) {
  if (n.length === 0) return new se(t.segments, {});
  {
    let r = uI(n),
      i = {};
    if (
      Object.keys(r).some((o) => o !== H) &&
      t.children[H] &&
      t.numberOfChildren === 1 &&
      t.children[H].segments.length === 0
    ) {
      let o = eo(t.children[H], e, n);
      return new se(t.segments, o.children);
    }
    return (
      Object.entries(r).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]),
          s !== null && (i[o] = gv(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        r[o] === void 0 && (i[o] = s);
      }),
      new se(t.segments, i)
    );
  }
}
function dI(t, e, n) {
  let r = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return o;
    let s = t.segments[i],
      a = n[r];
    if (io(a)) break;
    let l = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && l === void 0) break;
    if (l && c && typeof c == 'object' && c.outlets === void 0) {
      if (!Zm(l, c, s)) return o;
      r += 2;
    } else {
      if (!Zm(l, {}, s)) return o;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function cd(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (io(o)) {
      let l = fI(o.outlets);
      return new se(r, l);
    }
    if (i === 0 && Ca(n[0])) {
      let l = t.segments[e];
      r.push(new dr(l.path, Ym(n[0]))), i++;
      continue;
    }
    let s = io(o) ? o.outlets[H] : `${o}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    s && a && Ca(a)
      ? (r.push(new dr(s, Ym(a))), (i += 2))
      : (r.push(new dr(s, {})), i++);
  }
  return new se(r, {});
}
function fI(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == 'string' && (r = [r]),
        r !== null && (e[n] = cd(new se([], {}), 0, r));
    }),
    e
  );
}
function Ym(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function Zm(t, e, n) {
  return t == n.path && Qt(e, n.parameters);
}
var to = 'imperative',
  Fe = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = 'NavigationStart'),
      (t[(t.NavigationEnd = 1)] = 'NavigationEnd'),
      (t[(t.NavigationCancel = 2)] = 'NavigationCancel'),
      (t[(t.NavigationError = 3)] = 'NavigationError'),
      (t[(t.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (t[(t.ResolveStart = 5)] = 'ResolveStart'),
      (t[(t.ResolveEnd = 6)] = 'ResolveEnd'),
      (t[(t.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (t[(t.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (t[(t.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (t[(t.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (t[(t.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (t[(t.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (t[(t.ActivationStart = 13)] = 'ActivationStart'),
      (t[(t.ActivationEnd = 14)] = 'ActivationEnd'),
      (t[(t.Scroll = 15)] = 'Scroll'),
      (t[(t.NavigationSkipped = 16)] = 'NavigationSkipped'),
      t
    );
  })(Fe || {}),
  Et = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  li = class extends Et {
    constructor(e, n, r = 'imperative', i = null) {
      super(e, n),
        (this.type = Fe.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ot = class extends Et {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = Fe.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  dt = (function (t) {
    return (
      (t[(t.Redirect = 0)] = 'Redirect'),
      (t[(t.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (t[(t.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (t[(t.GuardRejected = 3)] = 'GuardRejected'),
      t
    );
  })(dt || {}),
  _a = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        'IgnoredByUrlHandlingStrategy'),
      t
    );
  })(_a || {}),
  Ln = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = Fe.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  kn = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = Fe.NavigationSkipped);
    }
  },
  oo = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = Fe.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ia = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = Fe.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ud = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = Fe.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  dd = class extends Et {
    constructor(e, n, r, i, o) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = Fe.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  fd = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = Fe.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  pd = class extends Et {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = Fe.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  hd = class {
    constructor(e) {
      (this.route = e), (this.type = Fe.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  gd = class {
    constructor(e) {
      (this.route = e), (this.type = Fe.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  md = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Fe.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  vd = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Fe.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  yd = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Fe.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  wd = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Fe.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Sa = class {
    constructor(e, n, r) {
      (this.routerEvent = e),
        (this.position = n),
        (this.anchor = r),
        (this.type = Fe.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  so = class {},
  ao = class {
    constructor(e) {
      this.url = e;
    }
  };
var Dd = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new go()),
        (this.attachRef = null);
    }
  },
  go = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let o = this.getOrCreateContext(r);
        (o.outlet = i), this.contexts.set(r, o);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new Dd()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Ta = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let n = this.pathFromRoot(e);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(e) {
      let n = Ed(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = Ed(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = Cd(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Cd(e, this._root).map((n) => n.value);
    }
  };
function Ed(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = Ed(t, n);
    if (r) return r;
  }
  return null;
}
function Cd(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = Cd(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var ut = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function ri(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var Ma = class extends Ta {
  constructor(e, n) {
    super(e), (this.snapshot = n), Rd(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function mv(t) {
  let e = pI(t),
    n = new ke([new dr('', {})]),
    r = new ke({}),
    i = new ke({}),
    o = new ke({}),
    s = new ke(''),
    a = new et(n, r, o, s, i, H, t, e.root);
  return (a.snapshot = e.root), new Ma(new ut(a, []), e);
}
function pI(t) {
  let e = {},
    n = {},
    r = {},
    i = '',
    o = new lo([], e, r, i, n, H, t, null, {});
  return new Aa('', new ut(o, []));
}
var et = class {
  constructor(e, n, r, i, o, s, a, l) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(Z((c) => c[po])) ?? R(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(Z((e) => si(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(Z((e) => si(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Nd(t, e, n = 'emptyOnly') {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === 'always' ||
      i?.path === '' ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: C(C({}, e.params), t.params),
          data: C(C({}, e.data), t.data),
          resolve: C(C(C(C({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: C({}, t.params),
          data: C({}, t.data),
          resolve: C(C({}, t.data), t._resolvedData ?? {}),
        }),
    i && yv(i) && (r.resolve[po] = i.title),
    r
  );
}
var lo = class {
    get title() {
      return this.data?.[po];
    }
    constructor(e, n, r, i, o, s, a, l, c) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= si(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= si(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join('/'),
        n = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  Aa = class extends Ta {
    constructor(e, n) {
      super(n), (this.url = e), Rd(this, n);
    }
    toString() {
      return vv(this._root);
    }
  };
function Rd(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => Rd(t, n));
}
function vv(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(vv).join(', ')} } ` : '';
  return `${t.value}${e}`;
}
function rd(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      Qt(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      Qt(e.params, n.params) || t.paramsSubject.next(n.params),
      H_(e.url, n.url) || t.urlSubject.next(n.url),
      Qt(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function bd(t, e) {
  let n = Qt(t.params, e.params) && q_(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || bd(t.parent, e.parent));
}
function yv(t) {
  return typeof t.title == 'string' || t.title === null;
}
var Od = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = H),
          (this.activateEvents = new Ce()),
          (this.deactivateEvents = new Ce()),
          (this.attachEvents = new Ce()),
          (this.detachEvents = new Ce()),
          (this.parentContexts = D(go)),
          (this.location = D(un)),
          (this.changeDetector = D(Rn)),
          (this.environmentInjector = D(Qe)),
          (this.inputBinder = D(Oa, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: o } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = r;
        let o = this.location,
          a = r.snapshot.component,
          l = this.parentContexts.getOrCreateContext(this.name).children,
          c = new _d(r, l, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name' },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        standalone: !0,
        features: [ar],
      }));
    let t = e;
    return t;
  })(),
  _d = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === et
        ? this.route
        : e === go
          ? this.childContexts
          : this.parent.get(e, n);
    }
  },
  Oa = new V(''),
  Jm = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(r) {
        this.unsubscribeFromRouteData(r), this.subscribeToRouteData(r);
      }
      unsubscribeFromRouteData(r) {
        this.outletDataSubscriptions.get(r)?.unsubscribe(),
          this.outletDataSubscriptions.delete(r);
      }
      subscribeToRouteData(r) {
        let { activatedRoute: i } = r,
          o = wi([i.queryParams, i.params, i.data])
            .pipe(
              mt(
                ([s, a, l], c) => (
                  (l = C(C(C({}, s), a), l)),
                  c === 0 ? R(l) : Promise.resolve(l)
                ),
              ),
            )
            .subscribe((s) => {
              if (
                !r.isActivated ||
                !r.activatedComponentRef ||
                r.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              let a = Cm(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              for (let { templateName: l } of a.inputs)
                r.activatedComponentRef.setInput(l, s[l]);
            });
        this.outletDataSubscriptions.set(r, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function hI(t, e, n) {
  let r = co(t, e._root, n ? n._root : void 0);
  return new Ma(r, e);
}
function co(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = gI(t, e, n);
    return new ut(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => co(t, a))),
          s
        );
      }
    }
    let r = mI(e.value),
      i = e.children.map((o) => co(t, o));
    return new ut(r, i);
  }
}
function gI(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return co(t, r, i);
    return co(t, r);
  });
}
function mI(t) {
  return new et(
    new ke(t.url),
    new ke(t.params),
    new ke(t.queryParams),
    new ke(t.fragment),
    new ke(t.data),
    t.outlet,
    t.component,
    t,
  );
}
var wv = 'ngNavigationCancelingError';
function Dv(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = ai(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Ev(!1, dt.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function Ev(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ''}`);
  return (n[wv] = !0), (n.cancellationCode = e), n;
}
function vI(t) {
  return Cv(t) && ai(t.url);
}
function Cv(t) {
  return !!t && t[wv];
}
var yI = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['ng-component']],
      standalone: !0,
      features: [q],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && W(0, 'router-outlet');
      },
      dependencies: [Od],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function wI(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Xs(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Pd(t) {
  let e = t.children && t.children.map(Pd),
    n = e ? Ee(C({}, t), { children: e }) : C({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== H &&
      (n.component = yI),
    n
  );
}
function Yt(t) {
  return t.outlet || H;
}
function DI(t, e) {
  let n = t.filter((r) => Yt(r) === e);
  return n.push(...t.filter((r) => Yt(r) !== e)), n;
}
function mo(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var EI = (t, e, n, r) =>
    Z(
      (i) => (
        new Id(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      ),
    ),
  Id = class {
    constructor(e, n, r, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        rd(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = ri(n);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], r), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if (i === o)
        if (i.component) {
          let s = r.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, n, s.children);
        } else this.deactivateChildRoutes(e, n, r);
      else o && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(e, n) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, n)
        : this.deactivateRouteAndOutlet(e, n);
    }
    detachAndStoreRouteSubtree(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = ri(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = ri(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = ri(n);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], r),
          this.forwardEvent(new wd(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new vd(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if ((rd(i), i === o))
        if (i.component) {
          let s = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, s.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let s = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            rd(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = mo(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  xa = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  oi = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function CI(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return Ji(r, i, n, [r.value]);
}
function bI(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function ui(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == 'function' && !sh(t) ? t : e.get(t)) : r;
}
function Ji(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = ri(e);
  return (
    t.children.forEach((s) => {
      _I(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => no(a, n.getContext(s), i)),
    i
  );
}
function _I(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = t.value,
    s = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let l = II(s, o, o.routeConfig.runGuardsAndResolvers);
    l
      ? i.canActivateChecks.push(new xa(r))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Ji(t, e, a ? a.children : null, r, i) : Ji(t, e, n, r, i),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new oi(a.outlet.component, s));
  } else
    s && no(e, a, i),
      i.canActivateChecks.push(new xa(r)),
      o.component
        ? Ji(t, null, a ? a.children : null, r, i)
        : Ji(t, null, n, r, i);
  return i;
}
function II(t, e, n) {
  if (typeof n == 'function') return n(t, e);
  switch (n) {
    case 'pathParamsChange':
      return !fr(t.url, e.url);
    case 'pathParamsOrQueryParamsChange':
      return !fr(t.url, e.url) || !Qt(t.queryParams, e.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !bd(t, e) || !Qt(t.queryParams, e.queryParams);
    case 'paramsChange':
    default:
      return !bd(t, e);
  }
}
function no(t, e, n) {
  let r = ri(t),
    i = t.value;
  Object.entries(r).forEach(([o, s]) => {
    i.component
      ? e
        ? no(s, e.children.getContext(o), n)
        : no(s, null, n)
      : no(s, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new oi(e.outlet.component, i))
        : n.canDeactivateChecks.push(new oi(null, i))
      : n.canDeactivateChecks.push(new oi(null, i));
}
function vo(t) {
  return typeof t == 'function';
}
function SI(t) {
  return typeof t == 'boolean';
}
function TI(t) {
  return t && vo(t.canLoad);
}
function MI(t) {
  return t && vo(t.canActivate);
}
function AI(t) {
  return t && vo(t.canActivateChild);
}
function xI(t) {
  return t && vo(t.canDeactivate);
}
function NI(t) {
  return t && vo(t.canMatch);
}
function bv(t) {
  return t instanceof tn || t?.name === 'EmptyError';
}
var ya = Symbol('INITIAL_VALUE');
function ci() {
  return mt((t) =>
    wi(t.map((e) => e.pipe(nn(1), _l(ya)))).pipe(
      Z((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === ya) return ya;
            if (n === !1 || n instanceof Fn) return n;
          }
        return !0;
      }),
      gt((e) => e !== ya),
      nn(1),
    ),
  );
}
function RI(t, e) {
  return be((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && o.length === 0
      ? R(Ee(C({}, n), { guardsResult: !0 }))
      : OI(s, r, i, t).pipe(
          be((a) => (a && SI(a) ? PI(r, o, t, e) : R(a))),
          Z((a) => Ee(C({}, n), { guardsResult: a })),
        );
  });
}
function OI(t, e, n, r) {
  return ve(t).pipe(
    be((i) => BI(i.component, i.route, n, e, r)),
    Lt((i) => i !== !0, !0),
  );
}
function PI(t, e, n, r) {
  return ve(e).pipe(
    Qn((i) =>
      Mr(
        LI(i.route.parent, r),
        FI(i.route, r),
        jI(t, i.path, n),
        kI(t, i.route, n),
      ),
    ),
    Lt((i) => i !== !0, !0),
  );
}
function FI(t, e) {
  return t !== null && e && e(new yd(t)), R(!0);
}
function LI(t, e) {
  return t !== null && e && e(new md(t)), R(!0);
}
function kI(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return R(!0);
  let i = r.map((o) =>
    Jo(() => {
      let s = mo(e) ?? n,
        a = ui(o, s),
        l = MI(a) ? a.canActivate(e, t) : sn(s, () => a(e, t));
      return Bn(l).pipe(Lt());
    }),
  );
  return R(i).pipe(ci());
}
function jI(t, e, n) {
  let r = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => bI(s))
      .filter((s) => s !== null)
      .map((s) =>
        Jo(() => {
          let a = s.guards.map((l) => {
            let c = mo(s.node) ?? n,
              u = ui(l, c),
              d = AI(u) ? u.canActivateChild(r, t) : sn(c, () => u(r, t));
            return Bn(d).pipe(Lt());
          });
          return R(a).pipe(ci());
        }),
      );
  return R(o).pipe(ci());
}
function BI(t, e, n, r, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return R(!0);
  let s = o.map((a) => {
    let l = mo(e) ?? i,
      c = ui(a, l),
      u = xI(c) ? c.canDeactivate(t, e, n, r) : sn(l, () => c(t, e, n, r));
    return Bn(u).pipe(Lt());
  });
  return R(s).pipe(ci());
}
function VI(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return R(!0);
  let o = i.map((s) => {
    let a = ui(s, t),
      l = TI(a) ? a.canLoad(e, n) : sn(t, () => a(e, n));
    return Bn(l);
  });
  return R(o).pipe(ci(), _v(r));
}
function _v(t) {
  return ml(
    je((e) => {
      if (ai(e)) throw Dv(t, e);
    }),
    Z((e) => e === !0),
  );
}
function UI(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return R(!0);
  let o = i.map((s) => {
    let a = ui(s, t),
      l = NI(a) ? a.canMatch(e, n) : sn(t, () => a(e, n));
    return Bn(l);
  });
  return R(o).pipe(ci(), _v(r));
}
var uo = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Na = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function ni(t) {
  return Tr(new uo(t));
}
function HI(t) {
  return Tr(new v(4e3, !1));
}
function $I(t) {
  return Tr(Ev(!1, dt.GuardRejected));
}
var Sd = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return R(r);
        if (i.numberOfChildren > 1 || !i.children[H]) return HI(e.redirectTo);
        i = i.children[H];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r,
      );
      if (n.startsWith('/')) throw new Na(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let o = this.createSegmentGroup(e, n.root, r, i);
      return new Fn(
        o,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == 'string' && o.startsWith(':')) {
            let a = o.substring(1);
            r[i] = n[a];
          } else r[i] = o;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let o = this.createSegments(e, n.segments, r, i),
        s = {};
      return (
        Object.entries(n.children).forEach(([a, l]) => {
          s[a] = this.createSegmentGroup(e, l, r, i);
        }),
        new se(o, s)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((o) =>
        o.path.startsWith(':')
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, r),
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new v(4001, !1);
      return i;
    }
    findOrReturn(e, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === e.path) return n.splice(r), i;
        r++;
      }
      return e;
    }
  },
  Td = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function zI(t, e, n, r, i) {
  let o = Fd(t, e, n);
  return o.matched
    ? ((r = wI(e, r)),
      UI(r, e, n, i).pipe(Z((s) => (s === !0 ? o : C({}, Td)))))
    : R(o);
}
function Fd(t, e, n) {
  if (e.path === '**') return WI(n);
  if (e.path === '')
    return e.pathMatch === 'full' && (t.hasChildren() || n.length > 0)
      ? C({}, Td)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || U_)(n, t, e);
  if (!i) return C({}, Td);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
    o[a] = l.path;
  });
  let s =
    i.consumed.length > 0
      ? C(C({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function WI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? rv(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Xm(t, e, n, r) {
  return n.length > 0 && KI(t, n, r)
    ? {
        segmentGroup: new se(e, GI(r, new se(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && QI(t, n, r)
      ? {
          segmentGroup: new se(t.segments, qI(t, n, r, t.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new se(t.segments, t.children), slicedSegments: n };
}
function qI(t, e, n, r) {
  let i = {};
  for (let o of n)
    if (Pa(t, e, o) && !r[Yt(o)]) {
      let s = new se([], {});
      i[Yt(o)] = s;
    }
  return C(C({}, r), i);
}
function GI(t, e) {
  let n = {};
  n[H] = e;
  for (let r of t)
    if (r.path === '' && Yt(r) !== H) {
      let i = new se([], {});
      n[Yt(r)] = i;
    }
  return n;
}
function KI(t, e, n) {
  return n.some((r) => Pa(t, e, r) && Yt(r) !== H);
}
function QI(t, e, n) {
  return n.some((r) => Pa(t, e, r));
}
function Pa(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === 'full'
    ? !1
    : n.path === '';
}
function YI(t, e, n, r) {
  return Yt(t) !== r && (r === H || !Pa(e, n, t)) ? !1 : Fd(e, t, n).matched;
}
function ZI(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var Md = class {};
function JI(t, e, n, r, i, o, s = 'emptyOnly') {
  return new Ad(t, e, n, r, i, s, o).recognize();
}
var XI = 31,
  Ad = class {
    constructor(e, n, r, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Sd(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new v(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = Xm(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        Z((n) => {
          let r = new lo(
              [],
              Object.freeze({}),
              Object.freeze(C({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              H,
              this.rootComponentType,
              null,
              {},
            ),
            i = new ut(r, n),
            o = new Aa('', i),
            s = sI(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        }),
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, H).pipe(
        En((r) => {
          if (r instanceof Na)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof uo ? this.noMatchError(r) : r;
        }),
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = Nd(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            Z((o) => (o instanceof ut ? [o] : [])),
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let o of Object.keys(r.children))
        o === 'primary' ? i.unshift(o) : i.push(o);
      return ve(i).pipe(
        Qn((o) => {
          let s = r.children[o],
            a = DI(n, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        bl((o, s) => (o.push(...s), o)),
        Cn(null),
        Cl(),
        be((o) => {
          if (o === null) return ni(r);
          let s = Iv(o);
          return eS(s), R(s);
        }),
      );
    }
    processSegment(e, n, r, i, o, s) {
      return ve(n).pipe(
        Qn((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            o,
            s,
          ).pipe(
            En((l) => {
              if (l instanceof uo) return R(null);
              throw l;
            }),
          ),
        ),
        Lt((a) => !!a),
        En((a) => {
          if (bv(a)) return ZI(r, i, o) ? R(new Md()) : ni(r);
          throw a;
        }),
      );
    }
    processSegmentAgainstRoute(e, n, r, i, o, s, a) {
      return YI(r, i, o, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, o, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, o, s)
            : ni(i)
        : ni(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
      let {
        matched: a,
        consumedSegments: l,
        positionalParamSegments: c,
        remainingSegments: u,
      } = Fd(n, i, o);
      if (!a) return ni(n);
      i.redirectTo.startsWith('/') &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > XI && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(be((f) => this.processSegment(e, r, n, f.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, o) {
      let s = zI(n, r, i, e, this.urlSerializer);
      return (
        r.path === '**' && (n.children = {}),
        s.pipe(
          mt((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  mt(({ routes: l }) => {
                    let c = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      p = new lo(
                        u,
                        f,
                        Object.freeze(C({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        nS(r),
                        Yt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        rS(r),
                      ),
                      { segmentGroup: h, slicedSegments: g } = Xm(n, u, d, l);
                    if (g.length === 0 && h.hasChildren())
                      return this.processChildren(c, l, h).pipe(
                        Z((A) => (A === null ? null : new ut(p, A))),
                      );
                    if (l.length === 0 && g.length === 0)
                      return R(new ut(p, []));
                    let M = Yt(r) === o;
                    return this.processSegment(c, l, h, g, M ? H : o, !0).pipe(
                      Z((A) => new ut(p, A instanceof ut ? [A] : [])),
                    );
                  }),
                ))
              : ni(n),
          ),
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? R({ routes: n.children, injector: e })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? R({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : VI(e, n, r, this.urlSerializer).pipe(
                be((i) =>
                  i
                    ? this.configLoader.loadChildren(e, n).pipe(
                        je((o) => {
                          (n._loadedRoutes = o.routes),
                            (n._loadedInjector = o.injector);
                        }),
                      )
                    : $I(n),
                ),
              )
          : R({ routes: [], injector: e });
    }
  };
function eS(t) {
  t.sort((e, n) =>
    e.value.outlet === H
      ? -1
      : n.value.outlet === H
        ? 1
        : e.value.outlet.localeCompare(n.value.outlet),
  );
}
function tS(t) {
  let e = t.value.routeConfig;
  return e && e.path === '';
}
function Iv(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!tS(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = Iv(r.children);
    e.push(new ut(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function nS(t) {
  return t.data || {};
}
function rS(t) {
  return t.resolve || {};
}
function iS(t, e, n, r, i, o) {
  return be((s) =>
    JI(t, e, n, r, s.extractedUrl, i, o).pipe(
      Z(({ state: a, tree: l }) =>
        Ee(C({}, s), { targetSnapshot: a, urlAfterRedirects: l }),
      ),
    ),
  );
}
function oS(t, e) {
  return be((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return R(n);
    let o = new Set(i.map((l) => l.route)),
      s = new Set();
    for (let l of o) if (!s.has(l)) for (let c of Sv(l)) s.add(c);
    let a = 0;
    return ve(s).pipe(
      Qn((l) =>
        o.has(l)
          ? sS(l, r, t, e)
          : ((l.data = Nd(l, l.parent, t).resolve), R(void 0)),
      ),
      je(() => a++),
      Ar(1),
      be((l) => (a === s.size ? R(n) : rt)),
    );
  });
}
function Sv(t) {
  let e = t.children.map((n) => Sv(n)).flat();
  return [t, ...e];
}
function sS(t, e, n, r) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !yv(i) && (o[po] = i.title),
    aS(o, t, e, r).pipe(
      Z(
        (s) => (
          (t._resolvedData = s), (t.data = Nd(t, t.parent, n).resolve), null
        ),
      ),
    )
  );
}
function aS(t, e, n, r) {
  let i = sd(t);
  if (i.length === 0) return R({});
  let o = {};
  return ve(i).pipe(
    be((s) =>
      lS(t[s], e, n, r).pipe(
        Lt(),
        je((a) => {
          o[s] = a;
        }),
      ),
    ),
    Ar(1),
    El(o),
    En((s) => (bv(s) ? rt : Tr(s))),
  );
}
function lS(t, e, n, r) {
  let i = mo(e) ?? r,
    o = ui(t, i),
    s = o.resolve ? o.resolve(e, n) : sn(i, () => o(e, n));
  return Bn(s);
}
function id(t) {
  return mt((e) => {
    let n = t(e);
    return n ? ve(n).pipe(Z(() => e)) : R(e);
  });
}
var Tv = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          o = r.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === H));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[po];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(cS), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  cS = (() => {
    let e = class e extends Tv {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Gm));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  yo = new V('', { providedIn: 'root', factory: () => ({}) }),
  fo = new V(''),
  Ld = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = D(la));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return R(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Bn(r.loadComponent()).pipe(
            Z(Mv),
            je((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            Di(() => {
              this.componentLoaders.delete(r);
            }),
          ),
          o = new Sr(i, () => new xe()).pipe(Ir());
        return this.componentLoaders.set(r, o), o;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return R({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = uS(i, this.compiler, r, this.onLoadEndListener).pipe(
            Di(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          a = new Sr(s, () => new xe()).pipe(Ir());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function uS(t, e, n, r) {
  return Bn(t.loadChildren()).pipe(
    Z(Mv),
    be((i) =>
      i instanceof Ni || Array.isArray(i) ? R(i) : ve(e.compileModuleAsync(i)),
    ),
    Z((i) => {
      r && r(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(n).injector),
            (s = o.get(fo, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Pd), injector: o }
      );
    }),
  );
}
function dS(t) {
  return t && typeof t == 'object' && 'default' in t;
}
function Mv(t) {
  return dS(t) ? t.default : t;
}
var kd = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(fS), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  fS = (() => {
    let e = class e {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, i) {
        return r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Av = new V(''),
  xv = new V('');
function pS(t, e, n) {
  let r = t.get(xv),
    i = t.get(de);
  return t.get(ne).runOutsideAngular(() => {
    if (!i.startViewTransition || r.skipNextTransition)
      return (r.skipNextTransition = !1), new Promise((c) => setTimeout(c));
    let o,
      s = new Promise((c) => {
        o = c;
      }),
      a = i.startViewTransition(() => (o(), hS(t))),
      { onViewTransitionCreated: l } = r;
    return l && sn(t, () => l({ transition: a, from: e, to: n })), s;
  });
}
function hS(t) {
  return new Promise((e) => {
    Js(e, { injector: t });
  });
}
var jd = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new xe()),
        (this.transitionAbortSubject = new xe()),
        (this.configLoader = D(Ld)),
        (this.environmentInjector = D(Qe)),
        (this.urlSerializer = D(ho)),
        (this.rootContexts = D(go)),
        (this.location = D(ei)),
        (this.inputBindingEnabled = D(Oa, { optional: !0 }) !== null),
        (this.titleStrategy = D(Tv)),
        (this.options = D(yo, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = D(kd)),
        (this.createViewTransition = D(Av, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => R(void 0)),
        (this.rootComponentType = null);
      let r = (o) => this.events.next(new hd(o)),
        i = (o) => this.events.next(new gd(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(
        Ee(C(C({}, this.transitions.value), r), { id: i }),
      );
    }
    setupNavigations(r, i, o) {
      return (
        (this.transitions = new ke({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: to,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          gt((s) => s.id !== 0),
          Z((s) =>
            Ee(C({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            }),
          ),
          mt((s) => {
            let a = !1,
              l = !1;
            return R(s).pipe(
              mt((c) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      '',
                      dt.SupersededByNewNavigation,
                    ),
                    rt
                  );
                (this.currentTransition = s),
                  (this.currentNavigation = {
                    id: c.id,
                    initialUrl: c.rawUrl,
                    extractedUrl: c.extractedUrl,
                    trigger: c.source,
                    extras: c.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? Ee(C({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let u =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                if (!u && d !== 'reload') {
                  let f = '';
                  return (
                    this.events.next(
                      new kn(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        f,
                        _a.IgnoredSameUrlNavigation,
                      ),
                    ),
                    c.resolve(null),
                    rt
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return R(c).pipe(
                    mt((f) => {
                      let p = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new li(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState,
                          ),
                        ),
                        p !== this.transitions?.getValue()
                          ? rt
                          : Promise.resolve(f)
                      );
                    }),
                    iS(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy,
                    ),
                    je((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = Ee(
                          C({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects },
                        ));
                      let p = new Ia(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot,
                      );
                      this.events.next(p);
                    }),
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: p,
                      source: h,
                      restoredState: g,
                      extras: M,
                    } = c,
                    A = new li(f, this.urlSerializer.serialize(p), h, g);
                  this.events.next(A);
                  let $ = mv(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      Ee(C({}, c), {
                        targetSnapshot: $,
                        urlAfterRedirects: p,
                        extras: Ee(C({}, M), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = p),
                    R(s)
                  );
                } else {
                  let f = '';
                  return (
                    this.events.next(
                      new kn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        _a.IgnoredByUrlHandlingStrategy,
                      ),
                    ),
                    c.resolve(null),
                    rt
                  );
                }
              }),
              je((c) => {
                let u = new ud(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                );
                this.events.next(u);
              }),
              Z(
                (c) => (
                  (this.currentTransition = s =
                    Ee(C({}, c), {
                      guards: CI(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts,
                      ),
                    })),
                  s
                ),
              ),
              RI(this.environmentInjector, (c) => this.events.next(c)),
              je((c) => {
                if (((s.guardsResult = c.guardsResult), ai(c.guardsResult)))
                  throw Dv(this.urlSerializer, c.guardsResult);
                let u = new dd(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult,
                );
                this.events.next(u);
              }),
              gt((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, '', dt.GuardRejected),
                    !1),
              ),
              id((c) => {
                if (c.guards.canActivateChecks.length)
                  return R(c).pipe(
                    je((u) => {
                      let d = new fd(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                    mt((u) => {
                      let d = !1;
                      return R(u).pipe(
                        oS(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector,
                        ),
                        je({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                '',
                                dt.NoDataFromResolver,
                              );
                          },
                        }),
                      );
                    }),
                    je((u) => {
                      let d = new pd(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                  );
              }),
              id((c) => {
                let u = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        je((p) => {
                          d.component = p;
                        }),
                        Z(() => {}),
                      ),
                    );
                  for (let p of d.children) f.push(...u(p));
                  return f;
                };
                return wi(u(c.targetSnapshot.root)).pipe(Cn(null), nn(1));
              }),
              id(() => this.afterPreactivation()),
              mt(() => {
                let { currentSnapshot: c, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    u.root,
                  );
                return d ? ve(d).pipe(Z(() => s)) : R(s);
              }),
              Z((c) => {
                let u = hI(
                  r.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState,
                );
                return (
                  (this.currentTransition = s =
                    Ee(C({}, c), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  s
                );
              }),
              je(() => {
                this.events.next(new so());
              }),
              EI(
                this.rootContexts,
                r.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled,
              ),
              nn(1),
              je({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Ot(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                      ),
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot,
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Il(
                this.transitionAbortSubject.pipe(
                  je((c) => {
                    throw c;
                  }),
                ),
              ),
              Di(() => {
                !a &&
                  !l &&
                  this.cancelNavigationTransition(
                    s,
                    '',
                    dt.SupersededByNewNavigation,
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              En((c) => {
                if (((l = !0), Cv(c)))
                  this.events.next(
                    new Ln(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode,
                    ),
                  ),
                    vI(c) ? this.events.next(new ao(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new oo(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0,
                    ),
                  );
                  try {
                    s.resolve(r.errorHandler(c));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(u);
                  }
                }
                return rt;
              }),
            );
          }),
        )
      );
    }
    cancelNavigationTransition(r, i, o) {
      let s = new Ln(r.id, this.urlSerializer.serialize(r.extractedUrl), i, o);
      this.events.next(s), r.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function gS(t) {
  return t !== to;
}
var mS = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(vS), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  xd = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, n) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, n) {
      return e.routeConfig === n.routeConfig;
    }
  },
  vS = (() => {
    let e = class e extends xd {};
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = cr(e)))(o || e);
      };
    })()),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Nv = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: () => D(yS), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  yS = (() => {
    let e = class e extends Nv {
      constructor() {
        super(...arguments),
          (this.location = D(ei)),
          (this.urlSerializer = D(ho)),
          (this.options = D(yo, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = D(kd)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new Fn()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = mv(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && r(i.url, i.state);
        });
      }
      handleRouterEvent(r, i) {
        if (r instanceof li) this.stateMemento = this.createStateMemento();
        else if (r instanceof kn) this.rawUrlTree = i.initialUrl;
        else if (r instanceof Ia) {
          if (
            this.urlUpdateStrategy === 'eager' &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          r instanceof so
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl,
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Ln &&
                (r.code === dt.GuardRejected ||
                  r.code === dt.NoDataFromResolver)
              ? this.restoreHistory(i)
              : r instanceof oo
                ? this.restoreHistory(i, !0)
                : r instanceof Ot &&
                  ((this.lastSuccessfulId = r.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let o = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = C(C({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, '', a);
        } else {
          let s = C(
            C({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          );
          this.location.go(o, '', s);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r };
      }
    };
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = cr(e)))(o || e);
      };
    })()),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Xi = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = 'COMPLETE'),
      (t[(t.FAILED = 1)] = 'FAILED'),
      (t[(t.REDIRECTING = 2)] = 'REDIRECTING'),
      t
    );
  })(Xi || {});
function Rv(t, e) {
  t.events
    .pipe(
      gt(
        (n) =>
          n instanceof Ot ||
          n instanceof Ln ||
          n instanceof oo ||
          n instanceof kn,
      ),
      Z((n) =>
        n instanceof Ot || n instanceof kn
          ? Xi.COMPLETE
          : (
                n instanceof Ln
                  ? n.code === dt.Redirect ||
                    n.code === dt.SupersededByNewNavigation
                  : !1
              )
            ? Xi.REDIRECTING
            : Xi.FAILED,
      ),
      gt((n) => n !== Xi.REDIRECTING),
      nn(1),
    )
    .subscribe(() => {
      e();
    });
}
function wS(t) {
  throw t;
}
var DS = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  ES = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  Zt = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = D(ra)),
          (this.stateManager = D(Nv)),
          (this.options = D(yo, { optional: !0 }) || {}),
          (this.pendingTasks = D(ea)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = D(jd)),
          (this.urlSerializer = D(ho)),
          (this.location = D(ei)),
          (this.urlHandlingStrategy = D(kd)),
          (this._events = new xe()),
          (this.errorHandler = this.options.errorHandler || wS),
          (this.navigated = !1),
          (this.routeReuseStrategy = D(mS)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || 'ignore'),
          (this.config = D(fo, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!D(Oa, { optional: !0 })),
          (this.eventsSubscription = new Se()),
          (this.isNgZoneEnabled = D(ne) instanceof ne && ne.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Ln &&
                  i.code !== dt.Redirect &&
                  i.code !== dt.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Ot) this.navigated = !0;
              else if (i instanceof ao) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  l = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === 'eager' || gS(o.source),
                  };
                this.scheduleNavigation(a, to, null, l, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            bS(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              to,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, 'popstate', i);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(r, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = C({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let l = this.parseUrl(r);
        this.scheduleNavigation(l, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(Pd)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: l,
            preserveFragment: c,
          } = i,
          u = c ? this.currentUrlTree.fragment : a,
          d = null;
        switch (l) {
          case 'merge':
            d = C(C({}, this.currentUrlTree.queryParams), s);
            break;
          case 'preserve':
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let p = o ? o.snapshot : this.routerState.snapshot.root;
          f = fv(p);
        } catch {
          (typeof r[0] != 'string' || !r[0].startsWith('/')) && (r = []),
            (f = this.currentUrlTree.root);
        }
        return pv(f, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let o = ai(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, to, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return CS(r), this.navigateByUrl(this.createUrlTree(r, i), i);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(r, i) {
        let o;
        if (
          (i === !0 ? (o = C({}, DS)) : i === !1 ? (o = C({}, ES)) : (o = i),
          ai(r))
        )
          return Km(this.currentUrlTree, r, o);
        let s = this.parseUrl(r);
        return Km(this.currentUrlTree, s, o);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {},
        );
      }
      scheduleNavigation(r, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let l, c, u;
        a
          ? ((l = a.resolve), (c = a.reject), (u = a.promise))
          : (u = new Promise((f, p) => {
              (l = f), (c = p);
            }));
        let d = this.pendingTasks.add();
        return (
          Rv(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: s,
            resolve: l,
            reject: c,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function CS(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new v(4008, !1);
}
function bS(t) {
  return !(t instanceof so) && !(t instanceof ao);
}
var jn = (() => {
    let e = class e {
      constructor(r, i, o, s, a, l) {
        (this.router = r),
          (this.route = i),
          (this.tabIndexAttribute = o),
          (this.renderer = s),
          (this.el = a),
          (this.locationStrategy = l),
          (this.href = null),
          (this.commands = null),
          (this.onChanges = new xe()),
          (this.preserveFragment = !1),
          (this.skipLocationChange = !1),
          (this.replaceUrl = !1);
        let c = a.nativeElement.tagName?.toLowerCase();
        (this.isAnchorElement = c === 'a' || c === 'area'),
          this.isAnchorElement
            ? (this.subscription = r.events.subscribe((u) => {
                u instanceof Ot && this.updateHref();
              }))
            : this.setTabIndexIfNotOnNativeEl('0');
      }
      setTabIndexIfNotOnNativeEl(r) {
        this.tabIndexAttribute != null ||
          this.isAnchorElement ||
          this.applyAttributeValue('tabindex', r);
      }
      ngOnChanges(r) {
        this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
      }
      set routerLink(r) {
        r != null
          ? ((this.commands = Array.isArray(r) ? r : [r]),
            this.setTabIndexIfNotOnNativeEl('0'))
          : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
      }
      onClick(r, i, o, s, a) {
        let l = this.urlTree;
        if (
          l === null ||
          (this.isAnchorElement &&
            (r !== 0 ||
              i ||
              o ||
              s ||
              a ||
              (typeof this.target == 'string' && this.target != '_self')))
        )
          return !0;
        let c = {
          skipLocationChange: this.skipLocationChange,
          replaceUrl: this.replaceUrl,
          state: this.state,
          info: this.info,
        };
        return this.router.navigateByUrl(l, c), !this.isAnchorElement;
      }
      ngOnDestroy() {
        this.subscription?.unsubscribe();
      }
      updateHref() {
        let r = this.urlTree;
        this.href =
          r !== null && this.locationStrategy
            ? this.locationStrategy?.prepareExternalUrl(
                this.router.serializeUrl(r),
              )
            : null;
        let i =
          this.href === null
            ? null
            : wg(
                this.href,
                this.el.nativeElement.tagName.toLowerCase(),
                'href',
              );
        this.applyAttributeValue('href', i);
      }
      applyAttributeValue(r, i) {
        let o = this.renderer,
          s = this.el.nativeElement;
        i !== null ? o.setAttribute(s, r, i) : o.removeAttribute(s, r);
      }
      get urlTree() {
        return this.commands === null
          ? null
          : this.router.createUrlTree(this.commands, {
              relativeTo:
                this.relativeTo !== void 0 ? this.relativeTo : this.route,
              queryParams: this.queryParams,
              fragment: this.fragment,
              queryParamsHandling: this.queryParamsHandling,
              preserveFragment: this.preserveFragment,
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(Zt), b(et), tu('tabindex'), b(Nt), b(we), b(pn));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'routerLink', '']],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 1 &&
            st('click', function (a) {
              return o.onClick(
                a.button,
                a.ctrlKey,
                a.shiftKey,
                a.altKey,
                a.metaKey,
              );
            }),
            i & 2 && ue('target', o.target);
        },
        inputs: {
          target: 'target',
          queryParams: 'queryParams',
          fragment: 'fragment',
          queryParamsHandling: 'queryParamsHandling',
          state: 'state',
          info: 'info',
          relativeTo: 'relativeTo',
          preserveFragment: [
            j.HasDecoratorInputTransform,
            'preserveFragment',
            'preserveFragment',
            re,
          ],
          skipLocationChange: [
            j.HasDecoratorInputTransform,
            'skipLocationChange',
            'skipLocationChange',
            re,
          ],
          replaceUrl: [
            j.HasDecoratorInputTransform,
            'replaceUrl',
            'replaceUrl',
            re,
          ],
          routerLink: 'routerLink',
        },
        standalone: !0,
        features: [Dt, ar],
      }));
    let t = e;
    return t;
  })(),
  Fa = (() => {
    let e = class e {
      get isActive() {
        return this._isActive;
      }
      constructor(r, i, o, s, a) {
        (this.router = r),
          (this.element = i),
          (this.renderer = o),
          (this.cdr = s),
          (this.link = a),
          (this.classes = []),
          (this._isActive = !1),
          (this.routerLinkActiveOptions = { exact: !1 }),
          (this.isActiveChange = new Ce()),
          (this.routerEventsSubscription = r.events.subscribe((l) => {
            l instanceof Ot && this.update();
          }));
      }
      ngAfterContentInit() {
        R(this.links.changes, R(null))
          .pipe(Dn())
          .subscribe((r) => {
            this.update(), this.subscribeToEachLinkOnChanges();
          });
      }
      subscribeToEachLinkOnChanges() {
        this.linkInputChangesSubscription?.unsubscribe();
        let r = [...this.links.toArray(), this.link]
          .filter((i) => !!i)
          .map((i) => i.onChanges);
        this.linkInputChangesSubscription = ve(r)
          .pipe(Dn())
          .subscribe((i) => {
            this._isActive !== this.isLinkActive(this.router)(i) &&
              this.update();
          });
      }
      set routerLinkActive(r) {
        let i = Array.isArray(r) ? r : r.split(' ');
        this.classes = i.filter((o) => !!o);
      }
      ngOnChanges(r) {
        this.update();
      }
      ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe(),
          this.linkInputChangesSubscription?.unsubscribe();
      }
      update() {
        !this.links ||
          !this.router.navigated ||
          queueMicrotask(() => {
            let r = this.hasActiveLinks();
            this.classes.forEach((i) => {
              r
                ? this.renderer.addClass(this.element.nativeElement, i)
                : this.renderer.removeClass(this.element.nativeElement, i);
            }),
              r && this.ariaCurrentWhenActive !== void 0
                ? this.renderer.setAttribute(
                    this.element.nativeElement,
                    'aria-current',
                    this.ariaCurrentWhenActive.toString(),
                  )
                : this.renderer.removeAttribute(
                    this.element.nativeElement,
                    'aria-current',
                  ),
              this._isActive !== r &&
                ((this._isActive = r),
                this.cdr.markForCheck(),
                this.isActiveChange.emit(r));
          });
      }
      isLinkActive(r) {
        let i = _S(this.routerLinkActiveOptions)
          ? this.routerLinkActiveOptions
          : this.routerLinkActiveOptions.exact || !1;
        return (o) => {
          let s = o.urlTree;
          return s ? r.isActive(s, i) : !1;
        };
      }
      hasActiveLinks() {
        let r = this.isLinkActive(this.router);
        return (this.link && r(this.link)) || this.links.some(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(Zt), b(we), b(Nt), b(Rn), b(jn, 8));
    }),
      (e.ɵdir = Oe({
        type: e,
        selectors: [['', 'routerLinkActive', '']],
        contentQueries: function (i, o, s) {
          if ((i & 1 && zt(s, jn, 5), i & 2)) {
            let a;
            Wt((a = qt())) && (o.links = a);
          }
        },
        inputs: {
          routerLinkActiveOptions: 'routerLinkActiveOptions',
          ariaCurrentWhenActive: 'ariaCurrentWhenActive',
          routerLinkActive: 'routerLinkActive',
        },
        outputs: { isActiveChange: 'isActiveChange' },
        exportAs: ['routerLinkActive'],
        standalone: !0,
        features: [ar],
      }));
    let t = e;
    return t;
  })();
function _S(t) {
  return !!t.paths;
}
var Ra = class {};
var IS = (() => {
    let e = class e {
      constructor(r, i, o, s, a) {
        (this.router = r),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            gt((r) => r instanceof Ot),
            Qn(() => this.preload()),
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(r, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = Xs(s.providers, r, `Route: ${s.path}`));
          let a = s._injector ?? r,
            l = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(l, s.children ?? s._loadedRoutes));
        }
        return ve(o).pipe(Dn());
      }
      preloadConfig(r, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(r, i))
            : (o = R(null));
          let s = o.pipe(
            be((a) =>
              a === null
                ? R(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? r, a.routes)),
            ),
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return ve([s, a]).pipe(Dn());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(Zt), x(la), x(Qe), x(Ra), x(Ld));
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Ov = new V(''),
  SS = (() => {
    let e = class e {
      constructor(r, i, o, s, a = {}) {
        (this.urlSerializer = r),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = 'imperative'),
          (this.restoredId = 0),
          (this.store = {}),
          (this.environmentInjector = D(Qe)),
          (a.scrollPositionRestoration ||= 'disabled'),
          (a.anchorScrolling ||= 'disabled');
      }
      init() {
        this.options.scrollPositionRestoration !== 'disabled' &&
          this.viewportScroller.setHistoryScrollRestoration('manual'),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof li
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = r.navigationTrigger),
              (this.restoredId = r.restoredState
                ? r.restoredState.navigationId
                : 0))
            : r instanceof Ot
              ? ((this.lastId = r.id),
                this.scheduleScrollEvent(
                  r,
                  this.urlSerializer.parse(r.urlAfterRedirects).fragment,
                ))
              : r instanceof kn &&
                r.code === _a.IgnoredSameUrlNavigation &&
                ((this.lastSource = void 0),
                (this.restoredId = 0),
                this.scheduleScrollEvent(
                  r,
                  this.urlSerializer.parse(r.url).fragment,
                ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof Sa &&
            (r.position
              ? this.options.scrollPositionRestoration === 'top'
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === 'enabled' &&
                  this.viewportScroller.scrollToPosition(r.position)
              : r.anchor && this.options.anchorScrolling === 'enabled'
                ? this.viewportScroller.scrollToAnchor(r.anchor)
                : this.options.scrollPositionRestoration !== 'disabled' &&
                  this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(r, i) {
        this.zone.runOutsideAngular(() =>
          al(this, null, function* () {
            yield new Promise((o) => {
              setTimeout(() => {
                o();
              }),
                Js(
                  () => {
                    o();
                  },
                  { injector: this.environmentInjector },
                );
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new Sa(
                    r,
                    this.lastSource === 'popstate'
                      ? this.store[this.restoredId]
                      : null,
                    i,
                  ),
                );
              });
          }),
        );
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      Pg();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Pv(t, ...e) {
  return Ps([
    { provide: fo, multi: !0, useValue: t },
    [],
    { provide: et, useFactory: Fv, deps: [Zt] },
    { provide: aa, multi: !0, useFactory: Lv },
    e.map((n) => n.ɵproviders),
  ]);
}
function Fv(t) {
  return t.routerState.root;
}
function wo(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function Lv() {
  let t = D(Nn);
  return (e) => {
    let n = t.get(Xr);
    if (e !== n.components[0]) return;
    let r = t.get(Zt),
      i = t.get(kv);
    t.get(Bd) === 1 && r.initialNavigation(),
      t.get(jv, null, G.Optional)?.setUpPreloading(),
      t.get(Ov, null, G.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var kv = new V('', { factory: () => new xe() }),
  Bd = new V('', { providedIn: 'root', factory: () => 1 });
function TS() {
  return wo(2, [
    { provide: Bd, useValue: 0 },
    {
      provide: sa,
      multi: !0,
      deps: [Nn],
      useFactory: (e) => {
        let n = e.get(Rm, Promise.resolve());
        return () =>
          n.then(
            () =>
              new Promise((r) => {
                let i = e.get(Zt),
                  o = e.get(kv);
                Rv(i, () => {
                  r(!0);
                }),
                  (e.get(jd).afterPreactivation = () => (
                    r(!0), o.closed ? R(void 0) : o
                  )),
                  i.initialNavigation();
              }),
          );
      },
    },
  ]);
}
function MS() {
  return wo(3, [
    {
      provide: sa,
      multi: !0,
      useFactory: () => {
        let e = D(Zt);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Bd, useValue: 2 },
  ]);
}
var jv = new V('');
function AS(t) {
  return wo(0, [
    { provide: jv, useExisting: IS },
    { provide: Ra, useExisting: t },
  ]);
}
function Vd() {
  return wo(8, [Jm, { provide: Oa, useExisting: Jm }]);
}
function xS(t) {
  let e = [
    { provide: Av, useValue: pS },
    {
      provide: xv,
      useValue: C({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return wo(9, e);
}
var ev = new V('ROUTER_FORROOT_GUARD'),
  NS = [
    ei,
    { provide: ho, useClass: ro },
    Zt,
    go,
    { provide: et, useFactory: Fv, deps: [Zt] },
    Ld,
    [],
  ],
  La = (() => {
    let e = class e {
      constructor(r) {}
      static forRoot(r, i) {
        return {
          ngModule: e,
          providers: [
            NS,
            [],
            { provide: fo, multi: !0, useValue: r },
            { provide: ev, useFactory: FS, deps: [[Zt, new Pi(), new Rs()]] },
            { provide: yo, useValue: i || {} },
            i?.useHash ? OS() : PS(),
            RS(),
            i?.preloadingStrategy ? AS(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? LS(i) : [],
            i?.bindToComponentInputs ? Vd().ɵproviders : [],
            i?.enableViewTransitions ? xS().ɵproviders : [],
            kS(),
          ],
        };
      }
      static forChild(r) {
        return {
          ngModule: e,
          providers: [{ provide: fo, multi: !0, useValue: r }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(x(ev, 8));
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = _e({}));
    let t = e;
    return t;
  })();
function RS() {
  return {
    provide: Ov,
    useFactory: () => {
      let t = D(km),
        e = D(ne),
        n = D(yo),
        r = D(jd),
        i = D(ho);
      return (
        n.scrollOffset && t.setOffset(n.scrollOffset), new SS(i, r, t, e, n)
      );
    },
  };
}
function OS() {
  return { provide: pn, useClass: Pm };
}
function PS() {
  return { provide: pn, useClass: zu };
}
function FS(t) {
  return 'guarded';
}
function LS(t) {
  return [
    t.initialNavigation === 'disabled' ? MS().ɵproviders : [],
    t.initialNavigation === 'enabledBlocking' ? TS().ɵproviders : [],
  ];
}
var tv = new V('');
function kS() {
  return [
    { provide: tv, useFactory: Lv },
    { provide: aa, multi: !0, useExisting: tv },
  ];
}
var ka = (() => {
  let e = class e {
    transform(r) {
      let i = Math.floor(r / 3600),
        o = Math.floor((r % 3600) / 60),
        s = r % 60;
      return `${this.pad(i)}:${this.pad(o)}:${this.pad(s)}`;
    }
    pad(r) {
      return r < 10 ? '0' + r : r.toString();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵpipe = Os({ name: 'duration', type: e, pure: !0, standalone: !0 }));
  let t = e;
  return t;
})();
var hn = class t {
    static isArray(e, n = !0) {
      return Array.isArray(e) && (n || e.length !== 0);
    }
    static isObject(e, n = !0) {
      return (
        typeof e == 'object' &&
        !Array.isArray(e) &&
        e != null &&
        (n || Object.keys(e).length !== 0)
      );
    }
    static equals(e, n, r) {
      return r
        ? this.resolveFieldData(e, r) === this.resolveFieldData(n, r)
        : this.equalsByValue(e, n);
    }
    static equalsByValue(e, n) {
      if (e === n) return !0;
      if (e && n && typeof e == 'object' && typeof n == 'object') {
        var r = Array.isArray(e),
          i = Array.isArray(n),
          o,
          s,
          a;
        if (r && i) {
          if (((s = e.length), s != n.length)) return !1;
          for (o = s; o-- !== 0; )
            if (!this.equalsByValue(e[o], n[o])) return !1;
          return !0;
        }
        if (r != i) return !1;
        var l = this.isDate(e),
          c = this.isDate(n);
        if (l != c) return !1;
        if (l && c) return e.getTime() == n.getTime();
        var u = e instanceof RegExp,
          d = n instanceof RegExp;
        if (u != d) return !1;
        if (u && d) return e.toString() == n.toString();
        var f = Object.keys(e);
        if (((s = f.length), s !== Object.keys(n).length)) return !1;
        for (o = s; o-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(n, f[o])) return !1;
        for (o = s; o-- !== 0; )
          if (((a = f[o]), !this.equalsByValue(e[a], n[a]))) return !1;
        return !0;
      }
      return e !== e && n !== n;
    }
    static resolveFieldData(e, n) {
      if (e && n) {
        if (this.isFunction(n)) return n(e);
        if (n.indexOf('.') == -1) return e[n];
        {
          let r = n.split('.'),
            i = e;
          for (let o = 0, s = r.length; o < s; ++o) {
            if (i == null) return null;
            i = i[r[o]];
          }
          return i;
        }
      } else return null;
    }
    static isFunction(e) {
      return !!(e && e.constructor && e.call && e.apply);
    }
    static reorderArray(e, n, r) {
      let i;
      e &&
        n !== r &&
        (r >= e.length && ((r %= e.length), (n %= e.length)),
        e.splice(r, 0, e.splice(n, 1)[0]));
    }
    static insertIntoOrderedArray(e, n, r, i) {
      if (r.length > 0) {
        let o = !1;
        for (let s = 0; s < r.length; s++)
          if (this.findIndexInList(r[s], i) > n) {
            r.splice(s, 0, e), (o = !0);
            break;
          }
        o || r.push(e);
      } else r.push(e);
    }
    static findIndexInList(e, n) {
      let r = -1;
      if (n) {
        for (let i = 0; i < n.length; i++)
          if (n[i] == e) {
            r = i;
            break;
          }
      }
      return r;
    }
    static contains(e, n) {
      if (e != null && n && n.length) {
        for (let r of n) if (this.equals(e, r)) return !0;
      }
      return !1;
    }
    static removeAccents(e) {
      return (
        e &&
          (e = e
            .normalize('NFKD')
            .replace(new RegExp('\\p{Diacritic}', 'gu'), '')),
        e
      );
    }
    static isDate(e) {
      return Object.prototype.toString.call(e) === '[object Date]';
    }
    static isEmpty(e) {
      return (
        e == null ||
        e === '' ||
        (Array.isArray(e) && e.length === 0) ||
        (!this.isDate(e) && typeof e == 'object' && Object.keys(e).length === 0)
      );
    }
    static isNotEmpty(e) {
      return !this.isEmpty(e);
    }
    static compare(e, n, r, i = 1) {
      let o = -1,
        s = this.isEmpty(e),
        a = this.isEmpty(n);
      return (
        s && a
          ? (o = 0)
          : s
            ? (o = i)
            : a
              ? (o = -i)
              : typeof e == 'string' && typeof n == 'string'
                ? (o = e.localeCompare(n, r, { numeric: !0 }))
                : (o = e < n ? -1 : e > n ? 1 : 0),
        o
      );
    }
    static sort(e, n, r = 1, i, o = 1) {
      let s = t.compare(e, n, i, r),
        a = r;
      return (t.isEmpty(e) || t.isEmpty(n)) && (a = o === 1 ? r : o), a * s;
    }
    static merge(e, n) {
      if (!(e == null && n == null)) {
        {
          if (
            (e == null || typeof e == 'object') &&
            (n == null || typeof n == 'object')
          )
            return C(C({}, e || {}), n || {});
          if (
            (e == null || typeof e == 'string') &&
            (n == null || typeof n == 'string')
          )
            return [e || '', n || ''].join(' ');
        }
        return n || e;
      }
    }
    static isPrintableCharacter(e = '') {
      return this.isNotEmpty(e) && e.length === 1 && e.match(/\S| /);
    }
    static getItemValue(e, ...n) {
      return this.isFunction(e) ? e(...n) : e;
    }
    static findLastIndex(e, n) {
      let r = -1;
      if (this.isNotEmpty(e))
        try {
          r = e.findLastIndex(n);
        } catch {
          r = e.lastIndexOf([...e].reverse().find(n));
        }
      return r;
    }
    static findLast(e, n) {
      let r;
      if (this.isNotEmpty(e))
        try {
          r = e.findLast(n);
        } catch {
          r = [...e].reverse().find(n);
        }
      return r;
    }
    static deepEquals(e, n) {
      if (e === n) return !0;
      if (e && n && typeof e == 'object' && typeof n == 'object') {
        var r = Array.isArray(e),
          i = Array.isArray(n),
          o,
          s,
          a;
        if (r && i) {
          if (((s = e.length), s != n.length)) return !1;
          for (o = s; o-- !== 0; ) if (!this.deepEquals(e[o], n[o])) return !1;
          return !0;
        }
        if (r != i) return !1;
        var l = e instanceof Date,
          c = n instanceof Date;
        if (l != c) return !1;
        if (l && c) return e.getTime() == n.getTime();
        var u = e instanceof RegExp,
          d = n instanceof RegExp;
        if (u != d) return !1;
        if (u && d) return e.toString() == n.toString();
        var f = Object.keys(e);
        if (((s = f.length), s !== Object.keys(n).length)) return !1;
        for (o = s; o-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(n, f[o])) return !1;
        for (o = s; o-- !== 0; )
          if (((a = f[o]), !this.deepEquals(e[a], n[a]))) return !1;
        return !0;
      }
      return e !== e && n !== n;
    }
  },
  Bv = 0;
function Vv(t = 'pn_id_') {
  return Bv++, `${t}${Bv}`;
}
function jS() {
  let t = [],
    e = (o, s) => {
      let a = t.length > 0 ? t[t.length - 1] : { key: o, value: s },
        l = a.value + (a.key === o ? 0 : s) + 2;
      return t.push({ key: o, value: l }), l;
    },
    n = (o) => {
      t = t.filter((s) => s.value !== o);
    },
    r = () => (t.length > 0 ? t[t.length - 1].value : 0),
    i = (o) => (o && parseInt(o.style.zIndex, 10)) || 0;
  return {
    get: i,
    set: (o, s, a) => {
      s && (s.style.zIndex = String(e(o, a)));
    },
    clear: (o) => {
      o && (n(i(o)), (o.style.zIndex = ''));
    },
    getCurrent: () => r(),
  };
}
var Eo = jS();
var Uv = ['*'];
var $e = (() => {
  class t {
    static STARTS_WITH = 'startsWith';
    static CONTAINS = 'contains';
    static NOT_CONTAINS = 'notContains';
    static ENDS_WITH = 'endsWith';
    static EQUALS = 'equals';
    static NOT_EQUALS = 'notEquals';
    static IN = 'in';
    static LESS_THAN = 'lt';
    static LESS_THAN_OR_EQUAL_TO = 'lte';
    static GREATER_THAN = 'gt';
    static GREATER_THAN_OR_EQUAL_TO = 'gte';
    static BETWEEN = 'between';
    static IS = 'is';
    static IS_NOT = 'isNot';
    static BEFORE = 'before';
    static AFTER = 'after';
    static DATE_IS = 'dateIs';
    static DATE_IS_NOT = 'dateIsNot';
    static DATE_BEFORE = 'dateBefore';
    static DATE_AFTER = 'dateAfter';
  }
  return t;
})();
var ja = (() => {
    class t {
      ripple = !1;
      inputStyle = Vi('outlined');
      overlayOptions = {};
      csp = Vi({ nonce: void 0 });
      filterMatchModeOptions = {
        text: [
          $e.STARTS_WITH,
          $e.CONTAINS,
          $e.NOT_CONTAINS,
          $e.ENDS_WITH,
          $e.EQUALS,
          $e.NOT_EQUALS,
        ],
        numeric: [
          $e.EQUALS,
          $e.NOT_EQUALS,
          $e.LESS_THAN,
          $e.LESS_THAN_OR_EQUAL_TO,
          $e.GREATER_THAN,
          $e.GREATER_THAN_OR_EQUAL_TO,
        ],
        date: [$e.DATE_IS, $e.DATE_IS_NOT, $e.DATE_BEFORE, $e.DATE_AFTER],
      };
      translation = {
        startsWith: 'Starts with',
        contains: 'Contains',
        notContains: 'Not contains',
        endsWith: 'Ends with',
        equals: 'Equals',
        notEquals: 'Not equals',
        noFilter: 'No Filter',
        lt: 'Less than',
        lte: 'Less than or equal to',
        gt: 'Greater than',
        gte: 'Greater than or equal to',
        is: 'Is',
        isNot: 'Is not',
        before: 'Before',
        after: 'After',
        dateIs: 'Date is',
        dateIsNot: 'Date is not',
        dateBefore: 'Date is before',
        dateAfter: 'Date is after',
        clear: 'Clear',
        apply: 'Apply',
        matchAll: 'Match All',
        matchAny: 'Match Any',
        addRule: 'Add Rule',
        removeRule: 'Remove Rule',
        accept: 'Yes',
        reject: 'No',
        choose: 'Choose',
        upload: 'Upload',
        cancel: 'Cancel',
        pending: 'Pending',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        dayNames: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        monthNamesShort: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        chooseYear: 'Choose Year',
        chooseMonth: 'Choose Month',
        chooseDate: 'Choose Date',
        prevDecade: 'Previous Decade',
        nextDecade: 'Next Decade',
        prevYear: 'Previous Year',
        nextYear: 'Next Year',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        prevHour: 'Previous Hour',
        nextHour: 'Next Hour',
        prevMinute: 'Previous Minute',
        nextMinute: 'Next Minute',
        prevSecond: 'Previous Second',
        nextSecond: 'Next Second',
        am: 'am',
        pm: 'pm',
        dateFormat: 'mm/dd/yy',
        firstDayOfWeek: 0,
        today: 'Today',
        weekHeader: 'Wk',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        passwordPrompt: 'Enter a password',
        emptyMessage: 'No results found',
        searchMessage: '{0} results are available',
        selectionMessage: '{0} items selected',
        emptySelectionMessage: 'No selected item',
        emptySearchMessage: 'No results found',
        emptyFilterMessage: 'No results found',
        aria: {
          trueLabel: 'True',
          falseLabel: 'False',
          nullLabel: 'Not Selected',
          star: '1 star',
          stars: '{star} stars',
          selectAll: 'All items selected',
          unselectAll: 'All items unselected',
          close: 'Close',
          previous: 'Previous',
          next: 'Next',
          navigation: 'Navigation',
          scrollTop: 'Scroll Top',
          moveTop: 'Move Top',
          moveUp: 'Move Up',
          moveDown: 'Move Down',
          moveBottom: 'Move Bottom',
          moveToTarget: 'Move to Target',
          moveToSource: 'Move to Source',
          moveAllToTarget: 'Move All to Target',
          moveAllToSource: 'Move All to Source',
          pageLabel: '{page}',
          firstPageLabel: 'First Page',
          lastPageLabel: 'Last Page',
          nextPageLabel: 'Next Page',
          prevPageLabel: 'Previous Page',
          rowsPerPageLabel: 'Rows per page',
          previousPageLabel: 'Previous Page',
          jumpToPageDropdownLabel: 'Jump to Page Dropdown',
          jumpToPageInputLabel: 'Jump to Page Input',
          selectRow: 'Row Selected',
          unselectRow: 'Row Unselected',
          expandRow: 'Row Expanded',
          collapseRow: 'Row Collapsed',
          showFilterMenu: 'Show Filter Menu',
          hideFilterMenu: 'Hide Filter Menu',
          filterOperator: 'Filter Operator',
          filterConstraint: 'Filter Constraint',
          editRow: 'Row Edit',
          saveEdit: 'Save Edit',
          cancelEdit: 'Cancel Edit',
          listView: 'List View',
          gridView: 'Grid View',
          slide: 'Slide',
          slideNumber: '{slideNumber}',
          zoomImage: 'Zoom Image',
          zoomIn: 'Zoom In',
          zoomOut: 'Zoom Out',
          rotateRight: 'Rotate Right',
          rotateLeft: 'Rotate Left',
          listLabel: 'Option List',
          selectColor: 'Select a color',
          removeLabel: 'Remove',
          browseFiles: 'Browse Files',
          maximizeLabel: 'Maximize',
        },
      };
      zIndex = { modal: 1100, overlay: 1e3, menu: 1e3, tooltip: 1100 };
      translationSource = new xe();
      translationObserver = this.translationSource.asObservable();
      getTranslation(n) {
        return this.translation[n];
      }
      setTranslation(n) {
        (this.translation = C(C({}, this.translation), n)),
          this.translationSource.next(this.translation);
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = I({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Hv = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵcmp = L({
        type: t,
        selectors: [['p-header']],
        standalone: !0,
        features: [q],
        ngContentSelectors: Uv,
        decls: 1,
        vars: 0,
        template: function (r, i) {
          r & 1 && (Rt(), at(0));
        },
        encapsulation: 2,
      });
    }
    return t;
  })(),
  $v = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵcmp = L({
        type: t,
        selectors: [['p-footer']],
        standalone: !0,
        features: [q],
        ngContentSelectors: Uv,
        decls: 1,
        vars: 0,
        template: function (r, i) {
          r & 1 && (Rt(), at(0));
        },
        encapsulation: 2,
      });
    }
    return t;
  })(),
  di = (() => {
    class t {
      template;
      type;
      name;
      constructor(n) {
        this.template = n;
      }
      getType() {
        return this.name;
      }
      static ɵfac = function (r) {
        return new (r || t)(b(on));
      };
      static ɵdir = Oe({
        type: t,
        selectors: [['', 'pTemplate', '']],
        inputs: { type: 'type', name: [j.None, 'pTemplate', 'name'] },
        standalone: !0,
      });
    }
    return t;
  })(),
  pr = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵmod = Ie({ type: t });
      static ɵinj = _e({});
    }
    return t;
  })();
var BS = ['*', [['p-header']], [['p-footer']]],
  VS = ['*', 'p-header', 'p-footer'];
function US(t, e) {
  t & 1 && Ze(0);
}
function HS(t, e) {
  if (
    (t & 1 &&
      (w(0, 'div', 8), at(1, 1), S(2, US, 1, 0, 'ng-container', 6), E()),
    t & 2)
  ) {
    let n = P();
    y(2), m('ngTemplateOutlet', n.headerTemplate);
  }
}
function $S(t, e) {
  t & 1 && Ze(0);
}
function zS(t, e) {
  if (
    (t & 1 && (w(0, 'div', 9), B(1), S(2, $S, 1, 0, 'ng-container', 6), E()),
    t & 2)
  ) {
    let n = P();
    y(), Gt(' ', n.header, ' '), y(), m('ngTemplateOutlet', n.titleTemplate);
  }
}
function WS(t, e) {
  t & 1 && Ze(0);
}
function qS(t, e) {
  if (
    (t & 1 && (w(0, 'div', 10), B(1), S(2, WS, 1, 0, 'ng-container', 6), E()),
    t & 2)
  ) {
    let n = P();
    y(),
      Gt(' ', n.subheader, ' '),
      y(),
      m('ngTemplateOutlet', n.subtitleTemplate);
  }
}
function GS(t, e) {
  t & 1 && Ze(0);
}
function KS(t, e) {
  t & 1 && Ze(0);
}
function QS(t, e) {
  if (
    (t & 1 &&
      (w(0, 'div', 11), at(1, 2), S(2, KS, 1, 0, 'ng-container', 6), E()),
    t & 2)
  ) {
    let n = P();
    y(2), m('ngTemplateOutlet', n.footerTemplate);
  }
}
var Wv = (() => {
    class t {
      el;
      header;
      subheader;
      set style(n) {
        hn.equals(this._style(), n) || this._style.set(n);
      }
      styleClass;
      headerFacet;
      footerFacet;
      templates;
      headerTemplate;
      titleTemplate;
      subtitleTemplate;
      contentTemplate;
      footerTemplate;
      _style = Vi(null);
      constructor(n) {
        this.el = n;
      }
      ngAfterContentInit() {
        this.templates.forEach((n) => {
          switch (n.getType()) {
            case 'header':
              this.headerTemplate = n.template;
              break;
            case 'title':
              this.titleTemplate = n.template;
              break;
            case 'subtitle':
              this.subtitleTemplate = n.template;
              break;
            case 'content':
              this.contentTemplate = n.template;
              break;
            case 'footer':
              this.footerTemplate = n.template;
              break;
            default:
              this.contentTemplate = n.template;
              break;
          }
        });
      }
      getBlockableElement() {
        return this.el.nativeElement.children[0];
      }
      static ɵfac = function (r) {
        return new (r || t)(b(we));
      };
      static ɵcmp = L({
        type: t,
        selectors: [['p-card']],
        contentQueries: function (r, i, o) {
          if ((r & 1 && (zt(o, Hv, 5), zt(o, $v, 5), zt(o, di, 4)), r & 2)) {
            let s;
            Wt((s = qt())) && (i.headerFacet = s.first),
              Wt((s = qt())) && (i.footerFacet = s.first),
              Wt((s = qt())) && (i.templates = s);
          }
        },
        hostAttrs: [1, 'p-element'],
        inputs: {
          header: 'header',
          subheader: 'subheader',
          style: 'style',
          styleClass: 'styleClass',
        },
        ngContentSelectors: VS,
        decls: 9,
        vars: 10,
        consts: [
          [3, 'ngClass', 'ngStyle'],
          ['class', 'p-card-header', 4, 'ngIf'],
          [1, 'p-card-body'],
          ['class', 'p-card-title', 4, 'ngIf'],
          ['class', 'p-card-subtitle', 4, 'ngIf'],
          [1, 'p-card-content'],
          [4, 'ngTemplateOutlet'],
          ['class', 'p-card-footer', 4, 'ngIf'],
          [1, 'p-card-header'],
          [1, 'p-card-title'],
          [1, 'p-card-subtitle'],
          [1, 'p-card-footer'],
        ],
        template: function (r, i) {
          r & 1 &&
            (Rt(BS),
            w(0, 'div', 0),
            S(1, HS, 3, 1, 'div', 1),
            w(2, 'div', 2),
            S(3, zS, 3, 2, 'div', 3)(4, qS, 3, 2, 'div', 4),
            w(5, 'div', 5),
            at(6),
            S(7, GS, 1, 0, 'ng-container', 6),
            E(),
            S(8, QS, 3, 1, 'div', 7),
            E()()),
            r & 2 &&
              ($t(i.styleClass),
              m('ngClass', 'p-card p-component')('ngStyle', i._style()),
              ue('data-pc-name', 'card'),
              y(),
              m('ngIf', i.headerFacet || i.headerTemplate),
              y(2),
              m('ngIf', i.header || i.titleTemplate),
              y(),
              m('ngIf', i.subheader || i.subtitleTemplate),
              y(3),
              m('ngTemplateOutlet', i.contentTemplate),
              y(),
              m('ngIf', i.footerFacet || i.footerTemplate));
        },
        dependencies: [On, De, ti, Pn],
        styles: [
          `@layer primeng{.p-card-header img{width:100%}}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  qv = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵmod = Ie({ type: t });
      static ɵinj = _e({ imports: [le, pr] });
    }
    return t;
  })();
var ie = (() => {
  class t {
    static zindex = 1e3;
    static calculatedScrollbarWidth = null;
    static calculatedScrollbarHeight = null;
    static browser;
    static addClass(n, r) {
      n && r && (n.classList ? n.classList.add(r) : (n.className += ' ' + r));
    }
    static addMultipleClasses(n, r) {
      if (n && r)
        if (n.classList) {
          let i = r.trim().split(' ');
          for (let o = 0; o < i.length; o++) n.classList.add(i[o]);
        } else {
          let i = r.split(' ');
          for (let o = 0; o < i.length; o++) n.className += ' ' + i[o];
        }
    }
    static removeClass(n, r) {
      n &&
        r &&
        (n.classList
          ? n.classList.remove(r)
          : (n.className = n.className.replace(
              new RegExp('(^|\\b)' + r.split(' ').join('|') + '(\\b|$)', 'gi'),
              ' ',
            )));
    }
    static removeMultipleClasses(n, r) {
      n &&
        r &&
        [r]
          .flat()
          .filter(Boolean)
          .forEach((i) => i.split(' ').forEach((o) => this.removeClass(n, o)));
    }
    static hasClass(n, r) {
      return n && r
        ? n.classList
          ? n.classList.contains(r)
          : new RegExp('(^| )' + r + '( |$)', 'gi').test(n.className)
        : !1;
    }
    static siblings(n) {
      return Array.prototype.filter.call(n.parentNode.children, function (r) {
        return r !== n;
      });
    }
    static find(n, r) {
      return Array.from(n.querySelectorAll(r));
    }
    static findSingle(n, r) {
      return this.isElement(n) ? n.querySelector(r) : null;
    }
    static index(n) {
      let r = n.parentNode.childNodes,
        i = 0;
      for (var o = 0; o < r.length; o++) {
        if (r[o] == n) return i;
        r[o].nodeType == 1 && i++;
      }
      return -1;
    }
    static indexWithinGroup(n, r) {
      let i = n.parentNode ? n.parentNode.childNodes : [],
        o = 0;
      for (var s = 0; s < i.length; s++) {
        if (i[s] == n) return o;
        i[s].attributes && i[s].attributes[r] && i[s].nodeType == 1 && o++;
      }
      return -1;
    }
    static appendOverlay(n, r, i = 'self') {
      i !== 'self' && n && r && this.appendChild(n, r);
    }
    static alignOverlay(n, r, i = 'self', o = !0) {
      n &&
        r &&
        (o && (n.style.minWidth = `${t.getOuterWidth(r)}px`),
        i === 'self'
          ? this.relativePosition(n, r)
          : this.absolutePosition(n, r));
    }
    static relativePosition(n, r, i = !0) {
      let o = ($) => {
          if ($)
            return getComputedStyle($).getPropertyValue('position') ===
              'relative'
              ? $
              : o($.parentElement);
        },
        s = n.offsetParent
          ? { width: n.offsetWidth, height: n.offsetHeight }
          : this.getHiddenElementDimensions(n),
        a = r.offsetHeight,
        l = r.getBoundingClientRect(),
        c = this.getWindowScrollTop(),
        u = this.getWindowScrollLeft(),
        d = this.getViewport(),
        p = o(n)?.getBoundingClientRect() || { top: -1 * c, left: -1 * u },
        h,
        g;
      l.top + a + s.height > d.height
        ? ((h = l.top - p.top - s.height),
          (n.style.transformOrigin = 'bottom'),
          l.top + h < 0 && (h = -1 * l.top))
        : ((h = a + l.top - p.top), (n.style.transformOrigin = 'top'));
      let M = l.left + s.width - d.width,
        A = l.left - p.left;
      s.width > d.width
        ? (g = (l.left - p.left) * -1)
        : M > 0
          ? (g = A - M)
          : (g = l.left - p.left),
        (n.style.top = h + 'px'),
        (n.style.left = g + 'px'),
        i &&
          (n.style.marginTop =
            origin === 'bottom'
              ? 'calc(var(--p-anchor-gutter) * -1)'
              : 'calc(var(--p-anchor-gutter))');
    }
    static absolutePosition(n, r, i = !0) {
      let o = n.offsetParent
          ? { width: n.offsetWidth, height: n.offsetHeight }
          : this.getHiddenElementDimensions(n),
        s = o.height,
        a = o.width,
        l = r.offsetHeight,
        c = r.offsetWidth,
        u = r.getBoundingClientRect(),
        d = this.getWindowScrollTop(),
        f = this.getWindowScrollLeft(),
        p = this.getViewport(),
        h,
        g;
      u.top + l + s > p.height
        ? ((h = u.top + d - s),
          (n.style.transformOrigin = 'bottom'),
          h < 0 && (h = d))
        : ((h = l + u.top + d), (n.style.transformOrigin = 'top')),
        u.left + a > p.width
          ? (g = Math.max(0, u.left + f + c - a))
          : (g = u.left + f),
        (n.style.top = h + 'px'),
        (n.style.left = g + 'px'),
        i &&
          (n.style.marginTop =
            origin === 'bottom'
              ? 'calc(var(--p-anchor-gutter) * -1)'
              : 'calc(var(--p-anchor-gutter))');
    }
    static getParents(n, r = []) {
      return n.parentNode === null
        ? r
        : this.getParents(n.parentNode, r.concat([n.parentNode]));
    }
    static getScrollableParents(n) {
      let r = [];
      if (n) {
        let i = this.getParents(n),
          o = /(auto|scroll)/,
          s = (a) => {
            let l = window.getComputedStyle(a, null);
            return (
              o.test(l.getPropertyValue('overflow')) ||
              o.test(l.getPropertyValue('overflowX')) ||
              o.test(l.getPropertyValue('overflowY'))
            );
          };
        for (let a of i) {
          let l = a.nodeType === 1 && a.dataset.scrollselectors;
          if (l) {
            let c = l.split(',');
            for (let u of c) {
              let d = this.findSingle(a, u);
              d && s(d) && r.push(d);
            }
          }
          a.nodeType !== 9 && s(a) && r.push(a);
        }
      }
      return r;
    }
    static getHiddenElementOuterHeight(n) {
      (n.style.visibility = 'hidden'), (n.style.display = 'block');
      let r = n.offsetHeight;
      return (n.style.display = 'none'), (n.style.visibility = 'visible'), r;
    }
    static getHiddenElementOuterWidth(n) {
      (n.style.visibility = 'hidden'), (n.style.display = 'block');
      let r = n.offsetWidth;
      return (n.style.display = 'none'), (n.style.visibility = 'visible'), r;
    }
    static getHiddenElementDimensions(n) {
      let r = {};
      return (
        (n.style.visibility = 'hidden'),
        (n.style.display = 'block'),
        (r.width = n.offsetWidth),
        (r.height = n.offsetHeight),
        (n.style.display = 'none'),
        (n.style.visibility = 'visible'),
        r
      );
    }
    static scrollInView(n, r) {
      let i = getComputedStyle(n).getPropertyValue('borderTopWidth'),
        o = i ? parseFloat(i) : 0,
        s = getComputedStyle(n).getPropertyValue('paddingTop'),
        a = s ? parseFloat(s) : 0,
        l = n.getBoundingClientRect(),
        u =
          r.getBoundingClientRect().top +
          document.body.scrollTop -
          (l.top + document.body.scrollTop) -
          o -
          a,
        d = n.scrollTop,
        f = n.clientHeight,
        p = this.getOuterHeight(r);
      u < 0
        ? (n.scrollTop = d + u)
        : u + p > f && (n.scrollTop = d + u - f + p);
    }
    static fadeIn(n, r) {
      n.style.opacity = 0;
      let i = +new Date(),
        o = 0,
        s = function () {
          (o =
            +n.style.opacity.replace(',', '.') +
            (new Date().getTime() - i) / r),
            (n.style.opacity = o),
            (i = +new Date()),
            +o < 1 &&
              ((window.requestAnimationFrame && requestAnimationFrame(s)) ||
                setTimeout(s, 16));
        };
      s();
    }
    static fadeOut(n, r) {
      var i = 1,
        o = 50,
        s = r,
        a = o / s;
      let l = setInterval(() => {
        (i = i - a),
          i <= 0 && ((i = 0), clearInterval(l)),
          (n.style.opacity = i);
      }, o);
    }
    static getWindowScrollTop() {
      let n = document.documentElement;
      return (window.pageYOffset || n.scrollTop) - (n.clientTop || 0);
    }
    static getWindowScrollLeft() {
      let n = document.documentElement;
      return (window.pageXOffset || n.scrollLeft) - (n.clientLeft || 0);
    }
    static matches(n, r) {
      var i = Element.prototype,
        o =
          i.matches ||
          i.webkitMatchesSelector ||
          i.mozMatchesSelector ||
          i.msMatchesSelector ||
          function (s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
          };
      return o.call(n, r);
    }
    static getOuterWidth(n, r) {
      let i = n.offsetWidth;
      if (r) {
        let o = getComputedStyle(n);
        i += parseFloat(o.marginLeft) + parseFloat(o.marginRight);
      }
      return i;
    }
    static getHorizontalPadding(n) {
      let r = getComputedStyle(n);
      return parseFloat(r.paddingLeft) + parseFloat(r.paddingRight);
    }
    static getHorizontalMargin(n) {
      let r = getComputedStyle(n);
      return parseFloat(r.marginLeft) + parseFloat(r.marginRight);
    }
    static innerWidth(n) {
      let r = n.offsetWidth,
        i = getComputedStyle(n);
      return (r += parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)), r;
    }
    static width(n) {
      let r = n.offsetWidth,
        i = getComputedStyle(n);
      return (r -= parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)), r;
    }
    static getInnerHeight(n) {
      let r = n.offsetHeight,
        i = getComputedStyle(n);
      return (r += parseFloat(i.paddingTop) + parseFloat(i.paddingBottom)), r;
    }
    static getOuterHeight(n, r) {
      let i = n.offsetHeight;
      if (r) {
        let o = getComputedStyle(n);
        i += parseFloat(o.marginTop) + parseFloat(o.marginBottom);
      }
      return i;
    }
    static getHeight(n) {
      let r = n.offsetHeight,
        i = getComputedStyle(n);
      return (
        (r -=
          parseFloat(i.paddingTop) +
          parseFloat(i.paddingBottom) +
          parseFloat(i.borderTopWidth) +
          parseFloat(i.borderBottomWidth)),
        r
      );
    }
    static getWidth(n) {
      let r = n.offsetWidth,
        i = getComputedStyle(n);
      return (
        (r -=
          parseFloat(i.paddingLeft) +
          parseFloat(i.paddingRight) +
          parseFloat(i.borderLeftWidth) +
          parseFloat(i.borderRightWidth)),
        r
      );
    }
    static getViewport() {
      let n = window,
        r = document,
        i = r.documentElement,
        o = r.getElementsByTagName('body')[0],
        s = n.innerWidth || i.clientWidth || o.clientWidth,
        a = n.innerHeight || i.clientHeight || o.clientHeight;
      return { width: s, height: a };
    }
    static getOffset(n) {
      var r = n.getBoundingClientRect();
      return {
        top:
          r.top +
          (window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0),
        left:
          r.left +
          (window.pageXOffset ||
            document.documentElement.scrollLeft ||
            document.body.scrollLeft ||
            0),
      };
    }
    static replaceElementWith(n, r) {
      let i = n.parentNode;
      if (!i) throw "Can't replace element";
      return i.replaceChild(r, n);
    }
    static getUserAgent() {
      if (navigator && this.isClient()) return navigator.userAgent;
    }
    static isIE() {
      var n = window.navigator.userAgent,
        r = n.indexOf('MSIE ');
      if (r > 0) return !0;
      var i = n.indexOf('Trident/');
      if (i > 0) {
        var o = n.indexOf('rv:');
        return !0;
      }
      var s = n.indexOf('Edge/');
      return s > 0;
    }
    static isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    static isAndroid() {
      return /(android)/i.test(navigator.userAgent);
    }
    static isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    static appendChild(n, r) {
      if (this.isElement(r)) r.appendChild(n);
      else if (r && r.el && r.el.nativeElement)
        r.el.nativeElement.appendChild(n);
      else throw 'Cannot append ' + r + ' to ' + n;
    }
    static removeChild(n, r) {
      if (this.isElement(r)) r.removeChild(n);
      else if (r.el && r.el.nativeElement) r.el.nativeElement.removeChild(n);
      else throw 'Cannot remove ' + n + ' from ' + r;
    }
    static removeElement(n) {
      'remove' in Element.prototype ? n.remove() : n.parentNode.removeChild(n);
    }
    static isElement(n) {
      return typeof HTMLElement == 'object'
        ? n instanceof HTMLElement
        : n &&
            typeof n == 'object' &&
            n !== null &&
            n.nodeType === 1 &&
            typeof n.nodeName == 'string';
    }
    static calculateScrollbarWidth(n) {
      if (n) {
        let r = getComputedStyle(n);
        return (
          n.offsetWidth -
          n.clientWidth -
          parseFloat(r.borderLeftWidth) -
          parseFloat(r.borderRightWidth)
        );
      } else {
        if (this.calculatedScrollbarWidth !== null)
          return this.calculatedScrollbarWidth;
        let r = document.createElement('div');
        (r.className = 'p-scrollbar-measure'), document.body.appendChild(r);
        let i = r.offsetWidth - r.clientWidth;
        return (
          document.body.removeChild(r), (this.calculatedScrollbarWidth = i), i
        );
      }
    }
    static calculateScrollbarHeight() {
      if (this.calculatedScrollbarHeight !== null)
        return this.calculatedScrollbarHeight;
      let n = document.createElement('div');
      (n.className = 'p-scrollbar-measure'), document.body.appendChild(n);
      let r = n.offsetHeight - n.clientHeight;
      return (
        document.body.removeChild(n), (this.calculatedScrollbarWidth = r), r
      );
    }
    static invokeElementMethod(n, r, i) {
      n[r].apply(n, i);
    }
    static clearSelection() {
      if (window.getSelection)
        window.getSelection().empty
          ? window.getSelection().empty()
          : window.getSelection().removeAllRanges &&
            window.getSelection().rangeCount > 0 &&
            window.getSelection().getRangeAt(0).getClientRects().length > 0 &&
            window.getSelection().removeAllRanges();
      else if (document.selection && document.selection.empty)
        try {
          document.selection.empty();
        } catch {}
    }
    static getBrowser() {
      if (!this.browser) {
        let n = this.resolveUserAgent();
        (this.browser = {}),
          n.browser &&
            ((this.browser[n.browser] = !0),
            (this.browser.version = n.version)),
          this.browser.chrome
            ? (this.browser.webkit = !0)
            : this.browser.webkit && (this.browser.safari = !0);
      }
      return this.browser;
    }
    static resolveUserAgent() {
      let n = navigator.userAgent.toLowerCase(),
        r =
          /(chrome)[ \/]([\w.]+)/.exec(n) ||
          /(webkit)[ \/]([\w.]+)/.exec(n) ||
          /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(n) ||
          /(msie) ([\w.]+)/.exec(n) ||
          (n.indexOf('compatible') < 0 &&
            /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(n)) ||
          [];
      return { browser: r[1] || '', version: r[2] || '0' };
    }
    static isInteger(n) {
      return Number.isInteger
        ? Number.isInteger(n)
        : typeof n == 'number' && isFinite(n) && Math.floor(n) === n;
    }
    static isHidden(n) {
      return !n || n.offsetParent === null;
    }
    static isVisible(n) {
      return n && n.offsetParent != null;
    }
    static isExist(n) {
      return n !== null && typeof n < 'u' && n.nodeName && n.parentNode;
    }
    static focus(n, r) {
      n && document.activeElement !== n && n.focus(r);
    }
    static getFocusableSelectorString(n = '') {
      return `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n}`;
    }
    static getFocusableElements(n, r = '') {
      let i = this.find(n, this.getFocusableSelectorString(r)),
        o = [];
      for (let s of i) {
        let a = getComputedStyle(s);
        this.isVisible(s) &&
          a.display != 'none' &&
          a.visibility != 'hidden' &&
          o.push(s);
      }
      return o;
    }
    static getFocusableElement(n, r = '') {
      let i = this.findSingle(n, this.getFocusableSelectorString(r));
      if (i) {
        let o = getComputedStyle(i);
        if (
          this.isVisible(i) &&
          o.display != 'none' &&
          o.visibility != 'hidden'
        )
          return i;
      }
      return null;
    }
    static getFirstFocusableElement(n, r = '') {
      let i = this.getFocusableElements(n, r);
      return i.length > 0 ? i[0] : null;
    }
    static getLastFocusableElement(n, r) {
      let i = this.getFocusableElements(n, r);
      return i.length > 0 ? i[i.length - 1] : null;
    }
    static getNextFocusableElement(n, r = !1) {
      let i = t.getFocusableElements(n),
        o = 0;
      if (i && i.length > 0) {
        let s = i.indexOf(i[0].ownerDocument.activeElement);
        r
          ? s == -1 || s === 0
            ? (o = i.length - 1)
            : (o = s - 1)
          : s != -1 && s !== i.length - 1 && (o = s + 1);
      }
      return i[o];
    }
    static generateZIndex() {
      return (this.zindex = this.zindex || 999), ++this.zindex;
    }
    static getSelection() {
      return window.getSelection
        ? window.getSelection().toString()
        : document.getSelection
          ? document.getSelection().toString()
          : document.selection
            ? document.selection.createRange().text
            : null;
    }
    static getTargetElement(n, r) {
      if (!n) return null;
      switch (n) {
        case 'document':
          return document;
        case 'window':
          return window;
        case '@next':
          return r?.nextElementSibling;
        case '@prev':
          return r?.previousElementSibling;
        case '@parent':
          return r?.parentElement;
        case '@grandparent':
          return r?.parentElement.parentElement;
        default:
          let i = typeof n;
          if (i === 'string') return document.querySelector(n);
          if (i === 'object' && n.hasOwnProperty('nativeElement'))
            return this.isExist(n.nativeElement) ? n.nativeElement : void 0;
          let s = ((a) => !!(a && a.constructor && a.call && a.apply))(n)
            ? n()
            : n;
          return (s && s.nodeType === 9) || this.isExist(s) ? s : null;
      }
    }
    static isClient() {
      return !!(
        typeof window < 'u' &&
        window.document &&
        window.document.createElement
      );
    }
    static getAttribute(n, r) {
      if (n) {
        let i = n.getAttribute(r);
        return isNaN(i)
          ? i === 'true' || i === 'false'
            ? i === 'true'
            : i
          : +i;
      }
    }
    static calculateBodyScrollbarWidth() {
      return window.innerWidth - document.documentElement.offsetWidth;
    }
    static blockBodyScroll(n = 'p-overflow-hidden') {
      document.body.style.setProperty(
        '--scrollbar-width',
        this.calculateBodyScrollbarWidth() + 'px',
      ),
        this.addClass(document.body, n);
    }
    static unblockBodyScroll(n = 'p-overflow-hidden') {
      document.body.style.removeProperty('--scrollbar-width'),
        this.removeClass(document.body, n);
    }
    static createElement(n, r = {}, ...i) {
      if (n) {
        let o = document.createElement(n);
        return this.setAttributes(o, r), o.append(...i), o;
      }
    }
    static setAttribute(n, r = '', i) {
      this.isElement(n) && i !== null && i !== void 0 && n.setAttribute(r, i);
    }
    static setAttributes(n, r = {}) {
      if (this.isElement(n)) {
        let i = (o, s) => {
          let a = n?.$attrs?.[o] ? [n?.$attrs?.[o]] : [];
          return [s].flat().reduce((l, c) => {
            if (c != null) {
              let u = typeof c;
              if (u === 'string' || u === 'number') l.push(c);
              else if (u === 'object') {
                let d = Array.isArray(c)
                  ? i(o, c)
                  : Object.entries(c).map(([f, p]) =>
                      o === 'style' && (p || p === 0)
                        ? `${f.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${p}`
                        : p
                          ? f
                          : void 0,
                    );
                l = d.length ? l.concat(d.filter((f) => !!f)) : l;
              }
            }
            return l;
          }, a);
        };
        Object.entries(r).forEach(([o, s]) => {
          if (s != null) {
            let a = o.match(/^on(.+)/);
            a
              ? n.addEventListener(a[1].toLowerCase(), s)
              : o === 'pBind'
                ? this.setAttributes(n, s)
                : ((s =
                    o === 'class'
                      ? [...new Set(i('class', s))].join(' ').trim()
                      : o === 'style'
                        ? i('style', s).join(';').trim()
                        : s),
                  (n.$attrs = n.$attrs || {}) && (n.$attrs[o] = s),
                  n.setAttribute(o, s));
          }
        });
      }
    }
    static isFocusableElement(n, r = '') {
      return this.isElement(n)
        ? n.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r}`)
        : !1;
    }
  }
  return t;
})();
var Gv = (() => {
  class t {
    autofocus = !1;
    focused = !1;
    platformId = D(wt);
    document = D(de);
    host = D(we);
    ngAfterContentChecked() {
      this.autofocus === !1
        ? this.host.nativeElement.removeAttribute('autofocus')
        : this.host.nativeElement.setAttribute('autofocus', !0),
        this.focused || this.autoFocus();
    }
    ngAfterViewChecked() {
      this.focused || this.autoFocus();
    }
    autoFocus() {
      Gi(this.platformId) &&
        this.autofocus &&
        setTimeout(() => {
          let n = ie.getFocusableElements(this.host?.nativeElement);
          n.length === 0 && this.host.nativeElement.focus(),
            n.length > 0 && n[0].focus(),
            (this.focused = !0);
        });
    }
    static ɵfac = function (r) {
      return new (r || t)();
    };
    static ɵdir = Oe({
      type: t,
      selectors: [['', 'pAutoFocus', '']],
      hostAttrs: [1, 'p-element'],
      inputs: {
        autofocus: [j.HasDecoratorInputTransform, 'autofocus', 'autofocus', re],
      },
      standalone: !0,
      features: [Dt],
    });
  }
  return t;
})();
var ZS = ['*'],
  Ba = (() => {
    class t {
      label;
      spin = !1;
      styleClass;
      role;
      ariaLabel;
      ariaHidden;
      ngOnInit() {
        this.getAttributes();
      }
      getAttributes() {
        let n = hn.isEmpty(this.label);
        (this.role = n ? void 0 : 'img'),
          (this.ariaLabel = n ? void 0 : this.label),
          (this.ariaHidden = n);
      }
      getClassNames() {
        return `p-icon ${this.styleClass ? this.styleClass + ' ' : ''}${this.spin ? 'p-icon-spin' : ''}`;
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵcmp = L({
        type: t,
        selectors: [['ng-component']],
        hostAttrs: [1, 'p-element', 'p-icon-wrapper'],
        inputs: {
          label: 'label',
          spin: [j.HasDecoratorInputTransform, 'spin', 'spin', re],
          styleClass: 'styleClass',
        },
        standalone: !0,
        features: [Dt, q],
        ngContentSelectors: ZS,
        decls: 1,
        vars: 0,
        template: function (r, i) {
          r & 1 && (Rt(), at(0));
        },
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })();
var Kv = (() => {
  class t extends Ba {
    pathId;
    ngOnInit() {
      this.pathId = 'url(#' + Vv() + ')';
    }
    static ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = cr(t)))(i || t);
      };
    })();
    static ɵcmp = L({
      type: t,
      selectors: [['SpinnerIcon']],
      standalone: !0,
      features: [Ui, q],
      decls: 6,
      vars: 7,
      consts: [
        [
          'width',
          '14',
          'height',
          '14',
          'viewBox',
          '0 0 14 14',
          'fill',
          'none',
          'xmlns',
          'http://www.w3.org/2000/svg',
        ],
        [
          'd',
          'M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z',
          'fill',
          'currentColor',
        ],
        [3, 'id'],
        ['width', '14', 'height', '14', 'fill', 'white'],
      ],
      template: function (r, i) {
        r & 1 &&
          (xn(),
          w(0, 'svg', 0)(1, 'g'),
          W(2, 'path', 1),
          E(),
          w(3, 'defs')(4, 'clipPath', 2),
          W(5, 'rect', 3),
          E()()()),
          r & 2 &&
            ($t(i.getClassNames()),
            ue('aria-label', i.ariaLabel)('aria-hidden', i.ariaHidden)(
              'role',
              i.role,
            ),
            y(),
            ue('clip-path', i.pathId),
            y(3),
            m('id', i.pathId));
      },
      encapsulation: 2,
    });
  }
  return t;
})();
var Va = (() => {
    class t {
      document;
      platformId;
      renderer;
      el;
      zone;
      config;
      constructor(n, r, i, o, s, a) {
        (this.document = n),
          (this.platformId = r),
          (this.renderer = i),
          (this.el = o),
          (this.zone = s),
          (this.config = a);
      }
      animationListener;
      mouseDownListener;
      timeout;
      ngAfterViewInit() {
        Gi(this.platformId) &&
          this.config &&
          this.config.ripple &&
          this.zone.runOutsideAngular(() => {
            this.create(),
              (this.mouseDownListener = this.renderer.listen(
                this.el.nativeElement,
                'mousedown',
                this.onMouseDown.bind(this),
              ));
          });
      }
      onMouseDown(n) {
        let r = this.getInk();
        if (
          !r ||
          this.document.defaultView?.getComputedStyle(r, null).display ===
            'none'
        )
          return;
        if (
          (ie.removeClass(r, 'p-ink-active'),
          !ie.getHeight(r) && !ie.getWidth(r))
        ) {
          let a = Math.max(
            ie.getOuterWidth(this.el.nativeElement),
            ie.getOuterHeight(this.el.nativeElement),
          );
          (r.style.height = a + 'px'), (r.style.width = a + 'px');
        }
        let i = ie.getOffset(this.el.nativeElement),
          o =
            n.pageX -
            i.left +
            this.document.body.scrollTop -
            ie.getWidth(r) / 2,
          s =
            n.pageY -
            i.top +
            this.document.body.scrollLeft -
            ie.getHeight(r) / 2;
        this.renderer.setStyle(r, 'top', s + 'px'),
          this.renderer.setStyle(r, 'left', o + 'px'),
          ie.addClass(r, 'p-ink-active'),
          (this.timeout = setTimeout(() => {
            let a = this.getInk();
            a && ie.removeClass(a, 'p-ink-active');
          }, 401));
      }
      getInk() {
        let n = this.el.nativeElement.children;
        for (let r = 0; r < n.length; r++)
          if (
            typeof n[r].className == 'string' &&
            n[r].className.indexOf('p-ink') !== -1
          )
            return n[r];
        return null;
      }
      resetInk() {
        let n = this.getInk();
        n && ie.removeClass(n, 'p-ink-active');
      }
      onAnimationEnd(n) {
        this.timeout && clearTimeout(this.timeout),
          ie.removeClass(n.currentTarget, 'p-ink-active');
      }
      create() {
        let n = this.renderer.createElement('span');
        this.renderer.addClass(n, 'p-ink'),
          this.renderer.appendChild(this.el.nativeElement, n),
          this.renderer.setAttribute(n, 'aria-hidden', 'true'),
          this.renderer.setAttribute(n, 'role', 'presentation'),
          this.animationListener ||
            (this.animationListener = this.renderer.listen(
              n,
              'animationend',
              this.onAnimationEnd.bind(this),
            ));
      }
      remove() {
        let n = this.getInk();
        n &&
          (this.mouseDownListener && this.mouseDownListener(),
          this.animationListener && this.animationListener(),
          (this.mouseDownListener = null),
          (this.animationListener = null),
          ie.removeElement(n));
      }
      ngOnDestroy() {
        this.config && this.config.ripple && this.remove();
      }
      static ɵfac = function (r) {
        return new (r || t)(b(de), b(wt), b(Nt), b(we), b(ne), b(ja, 8));
      };
      static ɵdir = Oe({
        type: t,
        selectors: [['', 'pRipple', '']],
        hostAttrs: [1, 'p-ripple', 'p-element'],
        standalone: !0,
      });
    }
    return t;
  })(),
  Qv = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵmod = Ie({ type: t });
      static ɵinj = _e({});
    }
    return t;
  })();
var XS = ['*'],
  Yv = (t) => ({ class: t });
function eT(t, e) {
  t & 1 && Ze(0);
}
function tT(t, e) {
  if ((t & 1 && W(0, 'span', 8), t & 2)) {
    let n = P(3);
    m('ngClass', n.iconClass()),
      ue('aria-hidden', !0)('data-pc-section', 'loadingicon');
  }
}
function nT(t, e) {
  if ((t & 1 && W(0, 'SpinnerIcon', 9), t & 2)) {
    let n = P(3);
    m('styleClass', n.spinnerIconClass())('spin', !0),
      ue('aria-hidden', !0)('data-pc-section', 'loadingicon');
  }
}
function rT(t, e) {
  if (
    (t & 1 &&
      (pe(0), S(1, tT, 1, 3, 'span', 6)(2, nT, 1, 4, 'SpinnerIcon', 7), he()),
    t & 2)
  ) {
    let n = P(2);
    y(), m('ngIf', n.loadingIcon), y(), m('ngIf', !n.loadingIcon);
  }
}
function iT(t, e) {}
function oT(t, e) {
  if ((t & 1 && S(0, iT, 0, 0, 'ng-template', 10), t & 2)) {
    let n = P(2);
    m('ngIf', n.loadingIconTemplate);
  }
}
function sT(t, e) {
  if (
    (t & 1 &&
      (pe(0), S(1, rT, 3, 2, 'ng-container', 2)(2, oT, 1, 1, null, 5), he()),
    t & 2)
  ) {
    let n = P();
    y(),
      m('ngIf', !n.loadingIconTemplate),
      y(),
      m('ngTemplateOutlet', n.loadingIconTemplate)(
        'ngTemplateOutletContext',
        Kt(3, Yv, n.iconClass()),
      );
  }
}
function aT(t, e) {
  if ((t & 1 && W(0, 'span', 8), t & 2)) {
    let n = P(2);
    m('ngClass', n.iconClass()), ue('data-pc-section', 'icon');
  }
}
function lT(t, e) {}
function cT(t, e) {
  if ((t & 1 && S(0, lT, 0, 0, 'ng-template', 10), t & 2)) {
    let n = P(2);
    m('ngIf', !n.icon && n.iconTemplate);
  }
}
function uT(t, e) {
  if (
    (t & 1 && (pe(0), S(1, aT, 1, 2, 'span', 6)(2, cT, 1, 1, null, 5), he()),
    t & 2)
  ) {
    let n = P();
    y(),
      m('ngIf', n.icon && !n.iconTemplate),
      y(),
      m('ngTemplateOutlet', n.iconTemplate)(
        'ngTemplateOutletContext',
        Kt(3, Yv, n.iconClass()),
      );
  }
}
function dT(t, e) {
  if ((t & 1 && (w(0, 'span', 11), B(1), E()), t & 2)) {
    let n = P();
    ue('aria-hidden', n.icon && !n.label)('data-pc-section', 'label'),
      y(),
      lt(n.label);
  }
}
function fT(t, e) {
  if ((t & 1 && (w(0, 'span', 8), B(1), E()), t & 2)) {
    let n = P();
    $t(n.badgeClass),
      m('ngClass', n.badgeStyleClass()),
      ue('data-pc-section', 'badge'),
      y(),
      lt(n.badge);
  }
}
var Vn = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only',
  },
  Zv = (() => {
    class t {
      el;
      document;
      iconPos = 'left';
      loadingIcon;
      get label() {
        return this._label;
      }
      set label(n) {
        (this._label = n),
          this.initialized &&
            (this.updateLabel(), this.updateIcon(), this.setStyleClass());
      }
      get icon() {
        return this._icon;
      }
      set icon(n) {
        (this._icon = n),
          this.initialized && (this.updateIcon(), this.setStyleClass());
      }
      get loading() {
        return this._loading;
      }
      set loading(n) {
        (this._loading = n),
          this.initialized && (this.updateIcon(), this.setStyleClass());
      }
      severity;
      raised = !1;
      rounded = !1;
      text = !1;
      outlined = !1;
      size = null;
      plain = !1;
      _label;
      _icon;
      _loading = !1;
      initialized;
      get htmlElement() {
        return this.el.nativeElement;
      }
      _internalClasses = Object.values(Vn);
      spinnerIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon-spin">
        <g clip-path="url(#clip0_417_21408)">
            <path
                d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_417_21408">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>`;
      constructor(n, r) {
        (this.el = n), (this.document = r);
      }
      ngAfterViewInit() {
        ie.addMultipleClasses(this.htmlElement, this.getStyleClass().join(' ')),
          this.createIcon(),
          this.createLabel(),
          (this.initialized = !0);
      }
      getStyleClass() {
        let n = [Vn.button, Vn.component];
        return (
          this.icon &&
            !this.label &&
            hn.isEmpty(this.htmlElement.textContent) &&
            n.push(Vn.iconOnly),
          this.loading &&
            (n.push(Vn.disabled, Vn.loading),
            !this.icon && this.label && n.push(Vn.labelOnly),
            this.icon &&
              !this.label &&
              !hn.isEmpty(this.htmlElement.textContent) &&
              n.push(Vn.iconOnly)),
          this.text && n.push('p-button-text'),
          this.severity && n.push(`p-button-${this.severity}`),
          this.plain && n.push('p-button-plain'),
          this.raised && n.push('p-button-raised'),
          this.size && n.push(`p-button-${this.size}`),
          this.outlined && n.push('p-button-outlined'),
          this.rounded && n.push('p-button-rounded'),
          this.size === 'small' && n.push('p-button-sm'),
          this.size === 'large' && n.push('p-button-lg'),
          n
        );
      }
      setStyleClass() {
        let n = this.getStyleClass();
        this.htmlElement.classList.remove(...this._internalClasses),
          this.htmlElement.classList.add(...n);
      }
      createLabel() {
        if (!ie.findSingle(this.htmlElement, '.p-button-label') && this.label) {
          let r = this.document.createElement('span');
          this.icon && !this.label && r.setAttribute('aria-hidden', 'true'),
            (r.className = 'p-button-label'),
            r.appendChild(this.document.createTextNode(this.label)),
            this.htmlElement.appendChild(r);
        }
      }
      createIcon() {
        if (
          !ie.findSingle(this.htmlElement, '.p-button-icon') &&
          (this.icon || this.loading)
        ) {
          let r = this.document.createElement('span');
          (r.className = 'p-button-icon'),
            r.setAttribute('aria-hidden', 'true');
          let i = this.label ? 'p-button-icon-' + this.iconPos : null;
          i && ie.addClass(r, i);
          let o = this.getIconClass();
          o && ie.addMultipleClasses(r, o),
            !this.loadingIcon &&
              this.loading &&
              (r.innerHTML = this.spinnerIcon),
            this.htmlElement.insertBefore(r, this.htmlElement.firstChild);
        }
      }
      updateLabel() {
        let n = ie.findSingle(this.htmlElement, '.p-button-label');
        if (!this.label) {
          n && this.htmlElement.removeChild(n);
          return;
        }
        n ? (n.textContent = this.label) : this.createLabel();
      }
      updateIcon() {
        let n = ie.findSingle(this.htmlElement, '.p-button-icon'),
          r = ie.findSingle(this.htmlElement, '.p-button-label');
        this.loading
          ? !this.loadingIcon && n
            ? (n.innerHTML = this.spinnerIcon)
            : this.loadingIcon &&
              n &&
              (n.className = `p-button-icon ${this.loadingIcon}`)
          : this.icon && n
            ? (n.className = `p-button-icon ${this.icon}`)
            : n && ((n.innerHTML = ''), this.createIcon()),
          n
            ? this.iconPos
              ? (n.className =
                  'p-button-icon ' +
                  (r ? 'p-button-icon-' + this.iconPos : '') +
                  ' ' +
                  this.getIconClass())
              : (n.className = 'p-button-icon ' + this.getIconClass())
            : this.createIcon();
      }
      getIconClass() {
        return this.loading
          ? 'p-button-loading-icon ' +
              (this.loadingIcon ? this.loadingIcon : 'p-icon')
          : this.icon || 'p-hidden';
      }
      ngOnDestroy() {
        this.initialized = !1;
      }
      static ɵfac = function (r) {
        return new (r || t)(b(we), b(de));
      };
      static ɵdir = Oe({
        type: t,
        selectors: [['', 'pButton', '']],
        hostAttrs: [1, 'p-element'],
        inputs: {
          iconPos: 'iconPos',
          loadingIcon: 'loadingIcon',
          label: 'label',
          icon: 'icon',
          loading: 'loading',
          severity: 'severity',
          raised: [j.HasDecoratorInputTransform, 'raised', 'raised', re],
          rounded: [j.HasDecoratorInputTransform, 'rounded', 'rounded', re],
          text: [j.HasDecoratorInputTransform, 'text', 'text', re],
          outlined: [j.HasDecoratorInputTransform, 'outlined', 'outlined', re],
          size: 'size',
          plain: [j.HasDecoratorInputTransform, 'plain', 'plain', re],
        },
        standalone: !0,
        features: [Dt],
      });
    }
    return t;
  })(),
  Co = (() => {
    class t {
      el;
      type = 'button';
      iconPos = 'left';
      icon;
      badge;
      label;
      disabled;
      loading = !1;
      loadingIcon;
      raised = !1;
      rounded = !1;
      text = !1;
      plain = !1;
      severity;
      outlined = !1;
      link = !1;
      tabindex;
      size;
      style;
      styleClass;
      badgeClass;
      ariaLabel;
      autofocus;
      onClick = new Ce();
      onFocus = new Ce();
      onBlur = new Ce();
      contentTemplate;
      loadingIconTemplate;
      iconTemplate;
      templates;
      constructor(n) {
        this.el = n;
      }
      spinnerIconClass() {
        return Object.entries(this.iconClass())
          .filter(([, n]) => !!n)
          .reduce((n, [r]) => n + ` ${r}`, 'p-button-loading-icon');
      }
      iconClass() {
        let n = {
          'p-button-icon': !0,
          'p-button-icon-left': this.iconPos === 'left' && this.label,
          'p-button-icon-right': this.iconPos === 'right' && this.label,
          'p-button-icon-top': this.iconPos === 'top' && this.label,
          'p-button-icon-bottom': this.iconPos === 'bottom' && this.label,
        };
        return (
          this.loading
            ? (n[`p-button-loading-icon pi-spin ${this.loadingIcon ?? ''}`] =
                !0)
            : this.icon && (n[this.icon] = !0),
          n
        );
      }
      get buttonClass() {
        return {
          'p-button p-component': !0,
          'p-button-icon-only':
            (this.icon ||
              this.iconTemplate ||
              this.loadingIcon ||
              this.loadingIconTemplate) &&
            !this.label,
          'p-button-vertical':
            (this.iconPos === 'top' || this.iconPos === 'bottom') && this.label,
          'p-disabled': this.disabled || this.loading,
          'p-button-loading': this.loading,
          'p-button-loading-label-only':
            this.loading &&
            !this.icon &&
            this.label &&
            !this.loadingIcon &&
            this.iconPos === 'left',
          'p-button-link': this.link,
          [`p-button-${this.severity}`]: this.severity,
          'p-button-raised': this.raised,
          'p-button-rounded': this.rounded,
          'p-button-text': this.text,
          'p-button-outlined': this.outlined,
          'p-button-sm': this.size === 'small',
          'p-button-lg': this.size === 'large',
          'p-button-plain': this.plain,
          [`${this.styleClass}`]: this.styleClass,
        };
      }
      ngAfterContentInit() {
        this.templates?.forEach((n) => {
          switch (n.getType()) {
            case 'content':
              this.contentTemplate = n.template;
              break;
            case 'icon':
              this.iconTemplate = n.template;
              break;
            case 'loadingicon':
              this.loadingIconTemplate = n.template;
              break;
            default:
              this.contentTemplate = n.template;
              break;
          }
        });
      }
      badgeStyleClass() {
        return {
          'p-badge p-component': !0,
          'p-badge-no-gutter': this.badge && String(this.badge).length === 1,
        };
      }
      static ɵfac = function (r) {
        return new (r || t)(b(we));
      };
      static ɵcmp = L({
        type: t,
        selectors: [['p-button']],
        contentQueries: function (r, i, o) {
          if ((r & 1 && zt(o, di, 4), r & 2)) {
            let s;
            Wt((s = qt())) && (i.templates = s);
          }
        },
        hostAttrs: [1, 'p-element'],
        inputs: {
          type: 'type',
          iconPos: 'iconPos',
          icon: 'icon',
          badge: 'badge',
          label: 'label',
          disabled: [j.HasDecoratorInputTransform, 'disabled', 'disabled', re],
          loading: [j.HasDecoratorInputTransform, 'loading', 'loading', re],
          loadingIcon: 'loadingIcon',
          raised: [j.HasDecoratorInputTransform, 'raised', 'raised', re],
          rounded: [j.HasDecoratorInputTransform, 'rounded', 'rounded', re],
          text: [j.HasDecoratorInputTransform, 'text', 'text', re],
          plain: [j.HasDecoratorInputTransform, 'plain', 'plain', re],
          severity: 'severity',
          outlined: [j.HasDecoratorInputTransform, 'outlined', 'outlined', re],
          link: [j.HasDecoratorInputTransform, 'link', 'link', re],
          tabindex: [j.HasDecoratorInputTransform, 'tabindex', 'tabindex', zi],
          size: 'size',
          style: 'style',
          styleClass: 'styleClass',
          badgeClass: 'badgeClass',
          ariaLabel: 'ariaLabel',
          autofocus: [
            j.HasDecoratorInputTransform,
            'autofocus',
            'autofocus',
            re,
          ],
        },
        outputs: { onClick: 'onClick', onFocus: 'onFocus', onBlur: 'onBlur' },
        standalone: !0,
        features: [Dt, q],
        ngContentSelectors: XS,
        decls: 7,
        vars: 14,
        consts: [
          [
            'pRipple',
            '',
            'pAutoFocus',
            '',
            3,
            'click',
            'focus',
            'blur',
            'ngStyle',
            'disabled',
            'ngClass',
            'autofocus',
          ],
          [4, 'ngTemplateOutlet'],
          [4, 'ngIf'],
          ['class', 'p-button-label', 4, 'ngIf'],
          [3, 'ngClass', 'class', 4, 'ngIf'],
          [4, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
          [3, 'ngClass', 4, 'ngIf'],
          [3, 'styleClass', 'spin', 4, 'ngIf'],
          [3, 'ngClass'],
          [3, 'styleClass', 'spin'],
          [3, 'ngIf'],
          [1, 'p-button-label'],
        ],
        template: function (r, i) {
          r & 1 &&
            (Rt(),
            w(0, 'button', 0),
            st('click', function (s) {
              return i.onClick.emit(s);
            })('focus', function (s) {
              return i.onFocus.emit(s);
            })('blur', function (s) {
              return i.onBlur.emit(s);
            }),
            at(1),
            S(2, eT, 1, 0, 'ng-container', 1)(3, sT, 3, 5, 'ng-container', 2)(
              4,
              uT,
              3,
              5,
              'ng-container',
              2,
            )(5, dT, 2, 3, 'span', 3)(6, fT, 2, 5, 'span', 4),
            E()),
            r & 2 &&
              (m('ngStyle', i.style)('disabled', i.disabled || i.loading)(
                'ngClass',
                i.buttonClass,
              )('autofocus', i.autofocus),
              ue('type', i.type)('aria-label', i.ariaLabel)(
                'data-pc-name',
                'button',
              )('data-pc-section', 'root')('tabindex', i.tabindex),
              y(2),
              m('ngTemplateOutlet', i.contentTemplate),
              y(),
              m('ngIf', i.loading),
              y(),
              m('ngIf', !i.loading),
              y(),
              m('ngIf', !i.contentTemplate && i.label),
              y(),
              m('ngIf', !i.contentTemplate && i.badge));
        },
        dependencies: [De, ti, Pn, On, Va, Gv, Kv],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  Ua = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵmod = Ie({ type: t });
      static ɵinj = _e({ imports: [Co, pr] });
    }
    return t;
  })();
var Xv = [
    {
      adult: !1,
      backdrop_path: '/coATv42PoiLqAFKStJiMZs2r6Zb.jpg',
      genre_ids: [16, 10751, 18, 12, 35],
      id: 1022789,
      original_language: 'en',
      original_title: 'Inside Out 2',
      overview:
        "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who\u2019ve long been running a successful operation by all accounts, aren\u2019t sure how to feel when Anxiety shows up. And it looks like she\u2019s not alone.",
      popularity: 9750.804,
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      release_date: '2024-06-11',
      title: 'Inside Out 2',
      video: !1,
      vote_average: 7.763,
      vote_count: 226,
    },
    {
      adult: !1,
      backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbGXce.jpg',
      genre_ids: [878, 12, 28],
      id: 653346,
      original_language: 'en',
      original_title: 'Kingdom of the Planet of the Apes',
      overview:
        "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
      popularity: 4014.879,
      poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
      release_date: '2024-05-08',
      title: 'Kingdom of the Planet of the Apes',
      video: !1,
      vote_average: 6.824,
      vote_count: 1079,
    },
    {
      adult: !1,
      backdrop_path: '/hliXekHv7xc2cgXnMBLlp4Eihq8.jpg',
      genre_ids: [53, 27, 28, 9648],
      id: 1001311,
      original_language: 'fr',
      original_title: 'Sous la Seine',
      overview:
        'In the Summer of 2024, Paris is hosting the World Triathlon Championships on the Seine for the first time. Sophia, a brilliant scientist, learns from Mika, a young environmental activist, that a large shark is swimming deep in the river. To avoid a bloodbath at the heart of the city, they have no choice but to join forces with Adil, the Seine river police commander.',
      popularity: 2822.686,
      poster_path: '/qZPLK5ktRKa3CL4sKRZtj8UlPYc.jpg',
      release_date: '2024-06-05',
      title: 'Under Paris',
      video: !1,
      vote_average: 5.818,
      vote_count: 535,
    },
    {
      adult: !1,
      backdrop_path: '/gRApXuxWmO2forYTuTmcz5RaNUV.jpg',
      genre_ids: [28, 80, 53, 35],
      id: 573435,
      original_language: 'en',
      original_title: 'Bad Boys: Ride or Die',
      overview:
        'After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.',
      popularity: 2744.583,
      poster_path: '/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
      release_date: '2024-06-05',
      title: 'Bad Boys: Ride or Die',
      video: !1,
      vote_average: 7.066,
      vote_count: 305,
    },
    {
      adult: !1,
      backdrop_path: '/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg',
      genre_ids: [10752, 28, 18],
      id: 929590,
      original_language: 'en',
      original_title: 'Civil War',
      overview:
        'In the near future, a group of war journalists attempt to survive while reporting the truth as the United States stands on the brink of civil war.',
      popularity: 1707.985,
      poster_path: '/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
      release_date: '2024-04-10',
      title: 'Civil War',
      video: !1,
      vote_average: 7,
      vote_count: 1580,
    },
    {
      adult: !1,
      backdrop_path: '/9Or1qeUZyOSQVglRXGnqc6owp21.jpg',
      genre_ids: [28],
      id: 1115623,
      original_language: 'en',
      original_title: 'The Last Kumite',
      overview:
        'When Karate champion Michael Rivers wins the last tournament of his career, shady businessman Ron Hall offers him the opportunity to fight in an illegal Kumite in Bulgaria against the world\u2019s best martial artists.  When Michael declines, Hall has his daughter kidnapped and, in order to rescue her, Rivers is left with no choice but to compete in the deadly tournament. Arriving in Bulgaria, he finds out that he is not the only fighter whose loved one was taken. Rivers enlists the help of trainers Master Loren, and Julie Jackson but will it be enough for him to win the tournament and save his daughter\u2019s life?',
      popularity: 1246.18,
      poster_path: '/zDkaJgsPoSqa2cMe2hW2HAfyWwO.jpg',
      release_date: '2024-05-09',
      title: 'The Last Kumite',
      video: !1,
      vote_average: 5.467,
      vote_count: 15,
    },
    {
      adult: !1,
      backdrop_path: '/3TNSoa0UHGEzEz5ndXGjJVKo8RJ.jpg',
      genre_ids: [878, 28],
      id: 614933,
      original_language: 'en',
      original_title: 'Atlas',
      overview:
        'A brilliant counterterrorism analyst with a deep distrust of AI discovers it might be her only hope when a mission to capture a renegade robot goes awry.',
      popularity: 1161.652,
      poster_path: '/bcM2Tl5HlsvPBnL8DKP9Ie6vU4r.jpg',
      release_date: '2024-05-23',
      title: 'Atlas',
      video: !1,
      vote_average: 6.769,
      vote_count: 794,
    },
  ],
  ey = [
    {
      adult: !1,
      backdrop_path: '/coATv42PoiLqAFKStJiMZs2r6Zb.jpg',
      genre_ids: [16, 10751, 18, 12, 35],
      id: 1022789,
      original_language: 'en',
      original_title: 'Inside Out 2',
      overview:
        "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who\u2019ve long been running a successful operation by all accounts, aren\u2019t sure how to feel when Anxiety shows up. And it looks like she\u2019s not alone.",
      popularity: 9750.804,
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      release_date: '2024-06-11',
      title: 'Inside Out 2',
      video: !1,
      vote_average: 7.818,
      vote_count: 233,
    },
    {
      adult: !1,
      backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbGXce.jpg',
      genre_ids: [878, 12, 28],
      id: 653346,
      original_language: 'en',
      original_title: 'Kingdom of the Planet of the Apes',
      overview:
        "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
      popularity: 4014.879,
      poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
      release_date: '2024-05-08',
      title: 'Kingdom of the Planet of the Apes',
      video: !1,
      vote_average: 6.842,
      vote_count: 1090,
    },
    {
      adult: !1,
      backdrop_path: '/hliXekHv7xc2cgXnMBLlp4Eihq8.jpg',
      genre_ids: [53, 27, 28, 9648],
      id: 1001311,
      original_language: 'fr',
      original_title: 'Sous la Seine',
      overview:
        'In the Summer of 2024, Paris is hosting the World Triathlon Championships on the Seine for the first time. Sophia, a brilliant scientist, learns from Mika, a young environmental activist, that a large shark is swimming deep in the river. To avoid a bloodbath at the heart of the city, they have no choice but to join forces with Adil, the Seine river police commander.',
      popularity: 2822.686,
      poster_path: '/qZPLK5ktRKa3CL4sKRZtj8UlPYc.jpg',
      release_date: '2024-06-05',
      title: 'Under Paris',
      video: !1,
      vote_average: 5.838,
      vote_count: 542,
    },
    {
      adult: !1,
      backdrop_path: '/gRApXuxWmO2forYTuTmcz5RaNUV.jpg',
      genre_ids: [28, 80, 53, 35],
      id: 573435,
      original_language: 'en',
      original_title: 'Bad Boys: Ride or Die',
      overview:
        'After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.',
      popularity: 2744.583,
      poster_path: '/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
      release_date: '2024-06-05',
      title: 'Bad Boys: Ride or Die',
      video: !1,
      vote_average: 7.1,
      vote_count: 312,
    },
    {
      adult: !1,
      backdrop_path: '/j29ekbcLpBvxnGk6LjdTc2EI5SA.jpg',
      genre_ids: [16, 10751, 12, 18, 35],
      id: 150540,
      original_language: 'en',
      original_title: 'Inside Out',
      overview:
        'From an adventurous balloon ride above the clouds to a monster-filled metropolis, Academy Award\xAE-winning director Pete Docter (\u201CMonsters, Inc.,\u201D \u201CUp\u201D) has taken audiences to unique and imaginative places. In Disney and Pixar\u2019s original movie \u201C Inside Out,\u201D he will take us to the most extraordinary location of all\u2014inside the mind.',
      popularity: 2731.637,
      poster_path: '/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg',
      release_date: '2015-06-17',
      title: 'Inside Out',
      video: !1,
      vote_average: 7.916,
      vote_count: 20603,
    },
    {
      adult: !1,
      backdrop_path: '/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg',
      genre_ids: [878, 28, 12],
      id: 823464,
      original_language: 'en',
      original_title: 'Godzilla x Kong: The New Empire',
      overview:
        'Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence \u2013 and our own.',
      popularity: 2007.024,
      poster_path: '/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
      release_date: '2024-03-27',
      title: 'Godzilla x Kong: The New Empire',
      video: !1,
      vote_average: 7.218,
      vote_count: 2804,
    },
    {
      adult: !1,
      backdrop_path: '/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg',
      genre_ids: [10752, 28, 18],
      id: 929590,
      original_language: 'en',
      original_title: 'Civil War',
      overview:
        'In the near future, a group of war journalists attempt to survive while reporting the truth as the United States stands on the brink of civil war.',
      popularity: 1707.985,
      poster_path: '/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
      release_date: '2024-04-10',
      title: 'Civil War',
      video: !1,
      vote_average: 7.02,
      vote_count: 1587,
    },
    {
      adult: !1,
      backdrop_path: '/vblTCXOWUQGSc837vgbhDRi4HSc.jpg',
      genre_ids: [28, 80, 35, 53],
      id: 955555,
      original_language: 'ko',
      original_title: '\uBC94\uC8C4\uB3C4\uC2DC3',
      overview:
        'Detective Ma Seok-do changes his affiliation from the Geumcheon Police Station to the Metropolitan Investigation Team, in order to eradicate Japanese gangsters who enter Korea to commit heinous crimes.',
      popularity: 1415.101,
      poster_path: '/lW6IHrtaATxDKYVYoQGU5sh0OVm.jpg',
      release_date: '2023-05-31',
      title: 'The Roundup: No Way Out',
      video: !1,
      vote_average: 7.123,
      vote_count: 272,
    },
  ],
  ty = [
    {
      adult: !1,
      backdrop_path: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg',
      genre_ids: [18, 80],
      id: 278,
      original_language: 'en',
      original_title: 'The Shawshank Redemption',
      overview:
        'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
      popularity: 134.639,
      poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
      release_date: '1994-09-23',
      title: 'The Shawshank Redemption',
      video: !1,
      vote_average: 8.705,
      vote_count: 26320,
    },
    {
      adult: !1,
      backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
      genre_ids: [18, 80],
      id: 238,
      original_language: 'en',
      original_title: 'The Godfather',
      overview:
        'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
      popularity: 115.64,
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      release_date: '1972-03-14',
      title: 'The Godfather',
      video: !1,
      vote_average: 8.694,
      vote_count: 19963,
    },
    {
      adult: !1,
      backdrop_path: '/b6w7gKLQLS2zw4JK0XmKgQ4gnzr.jpg',
      genre_ids: [18, 80],
      id: 240,
      original_language: 'en',
      original_title: 'The Godfather Part II',
      overview:
        'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.',
      popularity: 106.361,
      poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
      release_date: '1974-12-20',
      title: 'The Godfather Part II',
      video: !1,
      vote_average: 8.6,
      vote_count: 12055,
    },
    {
      adult: !1,
      backdrop_path: '/zb6fM1CX41D9rF9hdgclu0peUmy.jpg',
      genre_ids: [18, 36, 10752],
      id: 424,
      original_language: 'en',
      original_title: "Schindler's List",
      overview:
        'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
      popularity: 66.619,
      poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
      release_date: '1993-12-15',
      title: "Schindler's List",
      video: !1,
      vote_average: 8.568,
      vote_count: 15463,
    },
    {
      adult: !1,
      backdrop_path: '/qqHQsStV6exghCM7zbObuYBiYxw.jpg',
      genre_ids: [18],
      id: 389,
      original_language: 'en',
      original_title: '12 Angry Men',
      overview:
        "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors' prejudices and preconceptions about the trial, the accused, and each other.",
      popularity: 64.799,
      poster_path: '/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
      release_date: '1957-04-10',
      title: '12 Angry Men',
      video: !1,
      vote_average: 8.543,
      vote_count: 8311,
    },
    {
      adult: !1,
      backdrop_path: '/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg',
      genre_ids: [35, 18, 10749],
      id: 19404,
      original_language: 'hi',
      original_title:
        '\u0926\u093F\u0932\u0935\u093E\u0932\u0947 \u0926\u0941\u0932\u094D\u0939\u0928\u093F\u092F\u093E \u0932\u0947 \u091C\u093E\u092F\u0947\u0902\u0917\u0947',
      overview:
        'Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has left for India to be married to her childhood fianc\xE9. Raj leaves for India with a mission at his hands, to claim his lady love under the noses of her whole family. Thus begins a saga.',
      popularity: 29.108,
      poster_path: '/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg',
      release_date: '1995-10-20',
      title: 'Dilwale Dulhania Le Jayenge',
      video: !1,
      vote_average: 8.537,
      vote_count: 4399,
    },
    {
      adult: !1,
      backdrop_path: '/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
      genre_ids: [16, 10751, 14],
      id: 129,
      original_language: 'ja',
      original_title: '\u5343\u3068\u5343\u5C0B\u306E\u795E\u96A0\u3057',
      overview:
        'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
      popularity: 107.431,
      poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
      release_date: '2001-07-20',
      title: 'Spirited Away',
      video: !1,
      vote_average: 8.537,
      vote_count: 16027,
    },
    {
      adult: !1,
      backdrop_path: '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
      genre_ids: [18, 28, 80, 53],
      id: 155,
      original_language: 'en',
      original_title: 'The Dark Knight',
      overview:
        'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
      popularity: 101.049,
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      release_date: '2008-07-16',
      title: 'The Dark Knight',
      video: !1,
      vote_average: 8.516,
      vote_count: 32080,
    },
    {
      adult: !1,
      backdrop_path: '/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
      genre_ids: [35, 53, 18],
      id: 496243,
      original_language: 'ko',
      original_title: '\uAE30\uC0DD\uCDA9',
      overview:
        "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      popularity: 86.976,
      poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      release_date: '2019-05-30',
      title: 'Parasite',
      video: !1,
      vote_average: 8.5,
      vote_count: 17646,
    },
    {
      adult: !1,
      backdrop_path: '/vxJ08SvwomfKbpboCWynC3uqUg4.jpg',
      genre_ids: [14, 18, 80],
      id: 497,
      original_language: 'en',
      original_title: 'The Green Mile',
      overview:
        "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the cell block's head guard, Paul Edgecomb, recognizes Coffey's miraculous gift, he tries desperately to help stave off the condemned man's execution.",
      popularity: 74.976,
      poster_path: '/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
      release_date: '1999-12-10',
      title: 'The Green Mile',
      video: !1,
      vote_average: 8.505,
      vote_count: 16904,
    },
  ],
  ny = [
    {
      adult: !1,
      backdrop_path: '/coATv42PoiLqAFKStJiMZs2r6Zb.jpg',
      genre_ids: [16, 10751, 18, 12, 35],
      id: 1022789,
      original_language: 'en',
      original_title: 'Inside Out 2',
      overview:
        "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who\u2019ve long been running a successful operation by all accounts, aren\u2019t sure how to feel when Anxiety shows up. And it looks like she\u2019s not alone.",
      popularity: 9750.804,
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      release_date: '2024-06-11',
      title: 'Inside Out 2',
      video: !1,
      vote_average: 7.866,
      vote_count: 242,
    },
    {
      adult: !1,
      backdrop_path: '/gRApXuxWmO2forYTuTmcz5RaNUV.jpg',
      genre_ids: [28, 80, 53, 35],
      id: 573435,
      original_language: 'en',
      original_title: 'Bad Boys: Ride or Die',
      overview:
        'After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.',
      popularity: 2744.583,
      poster_path: '/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
      release_date: '2024-06-05',
      title: 'Bad Boys: Ride or Die',
      video: !1,
      vote_average: 7.1,
      vote_count: 312,
    },
    {
      adult: !1,
      backdrop_path: '/oZDRuGHhe5uY8wBqFJcJZT9kdvJ.jpg',
      genre_ids: [27, 9648, 53],
      id: 1086747,
      original_language: 'en',
      original_title: 'The Watchers',
      overview:
        'A young artist gets stranded in an extensive, immaculate forest in western Ireland, where, after finding shelter, she becomes trapped alongside three strangers, stalked by mysterious creatures each night.',
      popularity: 1117.26,
      poster_path: '/vZVEUPychdvZLrTNwWErr9xZFmu.jpg',
      release_date: '2024-06-06',
      title: 'The Watchers',
      video: !1,
      vote_average: 5.896,
      vote_count: 134,
    },
    {
      adult: !1,
      backdrop_path: '/nv6F6tz7r61DUhE7zgHwLJFcTYp.jpg',
      genre_ids: [10749, 35, 80],
      id: 974635,
      original_language: 'en',
      original_title: 'Hit Man',
      overview:
        'A mild-mannered professor moonlighting as a fake hit man in police stings ignites a chain reaction of trouble when he falls for a potential client.',
      popularity: 832.05,
      poster_path: '/1126gjlBf4hTm9Sgf0ox3LGVEBt.jpg',
      release_date: '2024-05-16',
      title: 'Hit Man',
      video: !1,
      vote_average: 7.1,
      vote_count: 315,
    },
    {
      adult: !1,
      backdrop_path: '/vWzJDjLPmycnQ42IppEjMpIhrhc.jpg',
      genre_ids: [16, 35, 10751, 12],
      id: 748783,
      original_language: 'en',
      original_title: 'The Garfield Movie',
      overview:
        'Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure! After an unexpected reunion with his long-lost father \u2013 scruffy street cat Vic \u2013 Garfield and his canine friend Odie are forced from their perfectly pampered life into joining Vic in a hilarious, high-stakes heist.',
      popularity: 680.296,
      poster_path: '/p6AbOJvMQhBmffd0PIv0u8ghWeY.jpg',
      release_date: '2024-04-30',
      title: 'The Garfield Movie',
      video: !1,
      vote_average: 6.566,
      vote_count: 174,
    },
    {
      adult: !1,
      backdrop_path: '/5Eip60UDiPLASyKjmHPMruggTc4.jpg',
      genre_ids: [27, 9648, 53],
      id: 1041613,
      original_language: 'en',
      original_title: 'Immaculate',
      overview:
        'An American nun embarks on a new journey when she joins a remote convent in the Italian countryside. However, her warm welcome quickly turns into a living nightmare when she discovers her new home harbours a sinister secret and unspeakable horrors.',
      popularity: 509.32,
      poster_path: '/fdZpvODTX5wwkD0ikZNaClE4AoW.jpg',
      release_date: '2024-03-20',
      title: 'Immaculate',
      video: !1,
      vote_average: 6.3,
      vote_count: 607,
    },
    {
      adult: !1,
      backdrop_path: '/1m1rXopfNDVL3UMiv6kriYaJ3yE.jpg',
      genre_ids: [28, 53, 80, 878],
      id: 882059,
      original_language: 'en',
      original_title: 'Boy Kills World',
      overview:
        'When his family is murdered, a deaf-mute named Boy escapes to the jungle and is trained by a mysterious shaman to repress his childish imagination and become an instrument of death.',
      popularity: 427.268,
      poster_path: '/25JskXmchcYwj3jHRmcPm738MpB.jpg',
      release_date: '2024-04-24',
      title: 'Boy Kills World',
      video: !1,
      vote_average: 6.87,
      vote_count: 292,
    },
    {
      adult: !1,
      backdrop_path: '/fU3oaBud5SZadw6k1ycftYedmXJ.jpg',
      genre_ids: [16, 878, 28, 18],
      id: 1146972,
      original_language: 'ja',
      original_title:
        '\u6A5F\u52D5\u6226\u58EB\u30AC\u30F3\u30C0\u30E0SEED FREEDOM',
      overview:
        'In C.E.75, the fighting still continues. There are independence movements, and aggression by Blue Cosmos... In order to calm the situation, a global peace monitoring agency called COMPASS is established, with Lacus as its first president. As members of COMPASS, Kira and his comrades intervene into various regional battles. Then a newly established nation called Foundation proposes a joint operation against a Blue Cosmos stronghold.',
      popularity: 375.399,
      poster_path: '/1EBnttleJaKnWWyyEqfiSn76ZjT.jpg',
      release_date: '2024-01-26',
      title: 'Mobile Suit Gundam SEED FREEDOM',
      video: !1,
      vote_average: 6.289,
      vote_count: 19,
    },
    {
      adult: !1,
      backdrop_path: '/ycCj6Ssuu2IdM23AYR7B8nbxQPA.jpg',
      genre_ids: [16, 10751, 35, 28],
      id: 519182,
      original_language: 'en',
      original_title: 'Despicable Me 4',
      overview:
        'Gru and Lucy and their girls \u2014 Margo, Edith and Agnes \u2014 welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, and the family is forced to go on the run.',
      popularity: 373.149,
      poster_path: '/3w84hCFJATpiCO5g8hpdWVPBbmq.jpg',
      release_date: '2024-06-20',
      title: 'Despicable Me 4',
      video: !1,
      vote_average: 9,
      vote_count: 6,
    },
    {
      adult: !1,
      backdrop_path: '/rmNlWyez5cniGtXkgixG1ezdqVk.jpg',
      genre_ids: [28, 53],
      id: 1093995,
      original_language: 'en',
      original_title: 'Chief of Station',
      overview:
        'After learning that the death of his wife was not an accident, a former CIA Station Chief is forced back into the espionage underworld, teaming up with an adversary to unravel a conspiracy that challenges everything he thought he knew.',
      popularity: 351.28,
      poster_path: '/uuA01PTtPombRPvL9dvsBqOBJWm.jpg',
      release_date: '2024-05-02',
      title: 'Chief of Station',
      video: !1,
      vote_average: 5.357,
      vote_count: 49,
    },
    {
      adult: !1,
      backdrop_path: '/k37Ccgu05Am1xxgN5GaW0HX9Kkl.jpg',
      genre_ids: [27, 53],
      id: 1087388,
      original_language: 'en',
      original_title: 'Sting',
      overview:
        "After raising an unnervingly talented spider in secret, 12-year-old Charlotte must face the truth about her pet and fight for her family's survival.",
      popularity: 293.651,
      poster_path: '/zuSAZIG1PSrxFwPeAlGtg9LTwxo.jpg',
      release_date: '2024-04-12',
      title: 'Sting',
      video: !1,
      vote_average: 6.4,
      vote_count: 127,
    },
    {
      adult: !1,
      backdrop_path: '/uaSIzbRfwLidxRNMvdZAUwW3vtL.jpg',
      genre_ids: [28, 14, 10752],
      id: 856289,
      original_language: 'zh',
      original_title:
        '\u5C01\u795E\u7B2C\u4E00\u90E8\uFF1A\u671D\u6B4C\u98CE\u4E91',
      overview:
        'Based on the most well-known classical fantasy novel of China, Fengshenyanyi, the trilogy is a magnificent eastern high fantasy epic that recreates the prolonged mythical wars between humans, immortals and monsters, which happened more than three thousand years ago.',
      popularity: 234.995,
      poster_path: '/1v5ZteB49M0RUGYrf9R37Mz8yo2.jpg',
      release_date: '2023-07-20',
      title: 'Creation of the Gods I: Kingdom of Storms',
      video: !1,
      vote_average: 7,
      vote_count: 287,
    },
  ];
var Le = (() => {
  let e = class e {
    constructor() {
      (this.nowPlayingMovies = Xv),
        (this.popularMovies = ey),
        (this.topRatedMovies = ty),
        (this.upcomingMovies = ny),
        (this.favoriteMovies = []),
        (this.watchLaterMovies = []);
    }
    getMovies() {
      return [
        ...this.nowPlayingMovies,
        ...this.popularMovies,
        ...this.topRatedMovies,
        ...this.upcomingMovies,
      ];
    }
    getPopularMovies() {
      return this.popularMovies;
    }
    getNowPlayingMovies() {
      return this.nowPlayingMovies;
    }
    getTopRatedMovies() {
      return this.topRatedMovies;
    }
    getUpcomingMovies() {
      return this.upcomingMovies;
    }
    getFavoriteMovies() {
      return this.favoriteMovies;
    }
    getWatchLaterMovies() {
      return this.watchLaterMovies;
    }
    getMovieById(r) {
      return this.getMovies().find((i) => i.id === r);
    }
    addToFavorites(r) {
      this.favoriteMovies.some((i) => i.id === r.id)
        ? this.removeFromFavorites(r)
        : this.favoriteMovies.push(r);
    }
    removeFromFavorites(r) {
      this.favoriteMovies = this.favoriteMovies.filter((i) => i.id !== r.id);
    }
    addToWatchLater(r) {
      this.watchLaterMovies.some((i) => i.id === r.id)
        ? this.removeFromWatchLater(r)
        : this.watchLaterMovies.push(r);
    }
    removeFromWatchLater(r) {
      this.watchLaterMovies = this.watchLaterMovies.filter(
        (i) => i.id !== r.id,
      );
    }
    isFavorite(r) {
      return this.favoriteMovies.some((i) => i.id === r);
    }
    isInWatchList(r) {
      return this.watchLaterMovies.some((i) => i.id === r);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var pT = (t) => ({ 'background-image': t }),
  hT = (t) => ({ favorite: t }),
  gT = (t) => ['/movie', t],
  mT = (t) => ({ watchlist: t }),
  Ct = (() => {
    let e = class e {
      constructor(r) {
        this.movieService = r;
      }
      get isFavorite() {
        return this.movieService.isFavorite(this.movie.id);
      }
      get isInWatchList() {
        return this.movieService.isInWatchList(this.movie.id);
      }
      addToFavorites() {
        this.isFavorite
          ? this.movieService.removeFromFavorites(this.movie)
          : this.movieService.addToFavorites(this.movie);
      }
      addToWatchList() {
        this.isInWatchList
          ? this.movieService.removeFromWatchLater(this.movie)
          : this.movieService.addToWatchLater(this.movie);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(b(Le));
    }),
      (e.ɵcmp = L({
        type: e,
        selectors: [['app-movie-card']],
        inputs: { movie: 'movie' },
        standalone: !0,
        features: [q],
        decls: 18,
        vars: 22,
        consts: [
          [1, 'movie-card', 3, 'header', 'subheader', 'id', 'ngStyle'],
          [1, 'movie-card__wrapper'],
          [1, 'movie-card__overview'],
          [1, 'movie-card__box'],
          [
            'type',
            'button',
            'icon',
            'pi pi-heart',
            'styleClass',
            'movie-card__icon',
            1,
            'movie-card__btn',
            3,
            'click',
            'ngClass',
          ],
          [1, 'movie-card__inner-icon'],
          ['width', '44', 'height', '44', 1, 'movie-card__icon'],
          ['href', '/assets/icons/star.svg#star'],
          [1, 'sr-only'],
          [1, 'movie-card__rating'],
          [
            'type',
            'button',
            'icon',
            'pi pi-info-circle',
            'styleClass',
            'movie-card__icon',
            1,
            'movie-card__btn',
            3,
            'routerLink',
          ],
          [
            'type',
            'button',
            'icon',
            'pi pi-clock',
            'styleClass',
            'movie-card__icon',
            1,
            'movie-card__btn',
            3,
            'click',
            'ngClass',
          ],
        ],
        template: function (i, o) {
          if (
            (i & 1 &&
              (w(0, 'p-card', 0),
              Jr(1, 'duration'),
              w(2, 'div', 1)(3, 'p', 2),
              B(4),
              E(),
              W(5, 'p'),
              w(6, 'div', 3)(7, 'p-button', 4),
              st('click', function () {
                return o.addToFavorites();
              }),
              E(),
              w(8, 'div', 5),
              xn(),
              w(9, 'svg', 6),
              W(10, 'use', 7),
              E(),
              Yh(),
              w(11, 'span', 8),
              B(12, ' \u0420\u0435\u0439\u0442\u0438\u043D\u0433 '),
              E(),
              w(13, 'span', 9),
              B(14),
              Jr(15, 'number'),
              E()(),
              W(16, 'p-button', 10),
              w(17, 'p-button', 11),
              st('click', function () {
                return o.addToWatchList();
              }),
              E()()()()),
            i & 2)
          ) {
            let s;
            m('header', o.movie.original_title)(
              'subheader',
              o.movie.release_date +
                ' | ' +
                ta(
                  1,
                  9,
                  (s = o.movie.duration) !== null && s !== void 0 ? s : 0,
                ),
            )('id', o.movie.id)(
              'ngStyle',
              Kt(
                14,
                pT,
                'url( https://image.tmdb.org/t/p/w500/' +
                  o.movie.poster_path +
                  ')',
              ),
            ),
              y(4),
              lt(o.movie.overview),
              y(3),
              m('ngClass', Kt(16, hT, o.isFavorite)),
              y(7),
              Gt(' ', na(15, 11, o.movie.vote_average, '1.0-0'), ' '),
              y(2),
              m('routerLink', Kt(18, gT, o.movie.id)),
              y(),
              m('ngClass', Kt(20, mT, o.isInWatchList));
          }
        },
        dependencies: [le, On, Pn, pa, ka, qv, Wv, Ua, Co, jn],
        styles: [
          '.class[_ngcontent-%COMP%]{font-size:14px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}.movie-card[_ngcontent-%COMP%]{display:flex;align-items:flex-end;position:relative;background-repeat:no-repeat;background-position:center;background-size:cover;border-radius:20px 20px 0 0;height:100%;color:#fff}.movie-card__wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding-top:50%}.movie-card__title[_ngcontent-%COMP%]{font-size:16px;font-weight:700;line-height:1.3;margin-bottom:10px;text-transform:uppercase;color:#fff}.movie-card__overview[_ngcontent-%COMP%], .movie-card__duration[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;font-style:italic;text-align:justify;text-indent:20px;font-size:12px;color:#fff}.movie-card__box[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between}.movie-card__icon[_ngcontent-%COMP%]{stroke:currentColor;stroke-width:.5px;fill:none}.movie-card__btn[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:44px;height:44px;border-radius:5px;color:#fff;position:relative;transition:background-color .5s,box-shadow .5s,text-shadow .5s ease-in-out}.movie-card__btn[_ngcontent-%COMP%]:hover{background-color:#fff;color:#000}.movie-card__btn[_ngcontent-%COMP%]:focus{background-color:#000;box-shadow:0 0 0 2px #fff}.movie-card__btn[_ngcontent-%COMP%]:active{background-color:gray}.movie-card__btn.favorite[_ngcontent-%COMP%]{color:#ff7575}.movie-card__btn.watchlist[_ngcontent-%COMP%]{color:#6868ff}.movie-card__inner-icon[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:44px;height:44px;border-radius:5px;color:#fff;position:relative;transition:background-color .5s,box-shadow .5s,text-shadow .5s ease-in-out}.movie-card__rating[_ngcontent-%COMP%]{font-size:12px;line-height:1.4;position:absolute;text-align:center;width:12px;height:12px;border-radius:50%;color:#fff;display:inline-table}',
        ],
      }));
    let t = e;
    return t;
  })();
var ry = [
  { routeName: 'Favorites', routePath: 'favorites', routeIcon: 'icon-heart' },
  { routeName: 'WatchList', routePath: 'watch-later', routeIcon: 'icon-clock' },
];
function vT(t, e) {
  if ((t & 1 && (xn(), w(0, 'svg', 7), W(1, 'use'), E()), t & 2)) {
    let n = P().$implicit;
    y(), ue('href', 'assets/icons/sprite.svg#' + n.routeIcon);
  }
}
function yT(t, e) {
  if (
    (t & 1 &&
      (w(0, 'li', 4)(1, 'a', 5),
      S(2, vT, 2, 1, 'svg', 6),
      w(3, 'span'),
      B(4),
      E()()()),
    t & 2)
  ) {
    let n = e.$implicit;
    y(),
      m('routerLink', n.routePath),
      y(),
      m('ngIf', n.routeIcon),
      y(2),
      lt(n.routeName);
  }
}
var iy = (() => {
  let e = class e {
    constructor() {
      this.headerLinks = ry;
    }
    trackByRoutePath(r, i) {
      return i.routePath;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-header']],
      standalone: !0,
      features: [q],
      decls: 4,
      vars: 2,
      consts: [
        [1, 'header__nav', 'container', 'section'],
        [1, 'header__inner'],
        [1, 'header__list'],
        ['class', 'header__item', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [1, 'header__item'],
        [
          'routerLinkActive',
          'header__link_active',
          1,
          'movie-card__btn',
          3,
          'routerLink',
        ],
        ['class', 'icon', 'width', '24', 'height', '24', 4, 'ngIf'],
        ['width', '24', 'height', '24', 1, 'icon'],
      ],
      template: function (i, o) {
        i & 1 &&
          (w(0, 'nav', 0)(1, 'div', 1)(2, 'ul', 2),
          S(3, yT, 5, 3, 'li', 3),
          E()()()),
          i & 2 &&
            (y(3),
            m('ngForOf', o.headerLinks)('ngForTrackBy', o.trackByRoutePath));
      },
      dependencies: [le, He, De, jn, Fa],
      styles: [
        '.header__nav[_ngcontent-%COMP%]{text-align:center}.header__list[_ngcontent-%COMP%]{display:inline-flex;justify-content:space-evenly;align-items:center;gap:40px;background-color:#c8c8c8;border-radius:40px;padding:5px 20px}.movie-card__btn[_ngcontent-%COMP%]{align-self:center;font-size:28px;transition:background-color .5s ease-in-out}.movie-card__btn[_ngcontent-%COMP%]:hover{color:#fff}.movie-card__btn[_ngcontent-%COMP%]:focus{color:red}.movie-card__btn[_ngcontent-%COMP%]:active{color:green}',
      ],
    }));
  let t = e;
  return t;
})();
function wT(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 6), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function DT(t, e) {
  if ((t & 1 && (pe(0), S(1, wT, 1, 1, 'app-movie-card', 5), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.movies)('ngForTrackBy', n.trackByMovieId);
  }
}
function ET(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var oy = (() => {
  let e = class e {
    constructor(r) {
      (this.movieService = r), (this.movies = []);
    }
    ngOnInit() {
      this.movies = this.movieService.getPopularMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-popular-page']],
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 2,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [1, 'title'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1)(1, 'h2', 2),
            B(2, 'Popular'),
            E(),
            w(3, 'div', 3),
            S(4, DT, 2, 2, 'ng-container', 4)(
              5,
              ET,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(6);
          y(4), m('ngIf', o.movies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
function CT(t, e) {
  t & 1 && (pe(0), w(1, 'h2', 5), B(2, 'Favorites:'), E(), he());
}
function bT(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 7), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function _T(t, e) {
  if ((t & 1 && (pe(0), S(1, bT, 1, 1, 'app-movie-card', 6), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.favoriteMovies)('ngForTrackBy', n.trackByMovieId);
  }
}
function IT(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var sy = (() => {
  let e = class e {
    constructor(r, i) {
      (this.route = r), (this.movieService = i), (this.favoriteMovies = []);
    }
    ngOnInit() {
      this.favoriteMovies = this.movieService.getFavoriteMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(et), b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-movie-favorites-page']],
      standalone: !0,
      features: [q],
      decls: 6,
      vars: 3,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [4, 'ngIf'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [1, 'title'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1),
            S(1, CT, 3, 0, 'ng-container', 2),
            w(2, 'div', 3),
            S(3, _T, 2, 2, 'ng-container', 4)(
              4,
              IT,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(5);
          y(),
            m('ngIf', o.favoriteMovies.length > 0),
            y(2),
            m('ngIf', o.favoriteMovies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
var k = (function (t) {
    return (
      (t[(t.State = 0)] = 'State'),
      (t[(t.Transition = 1)] = 'Transition'),
      (t[(t.Sequence = 2)] = 'Sequence'),
      (t[(t.Group = 3)] = 'Group'),
      (t[(t.Animate = 4)] = 'Animate'),
      (t[(t.Keyframes = 5)] = 'Keyframes'),
      (t[(t.Style = 6)] = 'Style'),
      (t[(t.Trigger = 7)] = 'Trigger'),
      (t[(t.Reference = 8)] = 'Reference'),
      (t[(t.AnimateChild = 9)] = 'AnimateChild'),
      (t[(t.AnimateRef = 10)] = 'AnimateRef'),
      (t[(t.Query = 11)] = 'Query'),
      (t[(t.Stagger = 12)] = 'Stagger'),
      t
    );
  })(k || {}),
  Jt = '*';
function ay(t, e) {
  return { type: k.Trigger, name: t, definitions: e, options: {} };
}
function Ud(t, e = null) {
  return { type: k.Animate, styles: e, timings: t };
}
function ly(t, e = null) {
  return { type: k.Sequence, steps: t, options: e };
}
function fi(t) {
  return { type: k.Style, styles: t, offset: null };
}
function Hd(t, e, n = null) {
  return { type: k.Transition, expr: t, animation: e, options: n };
}
function $d(t, e = null) {
  return { type: k.Reference, animation: t, options: e };
}
function zd(t, e = null) {
  return { type: k.AnimateRef, animation: t, options: e };
}
var Un = class {
    constructor(e = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let n = e == 'start' ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  bo = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let n = 0,
        r = 0,
        i = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++n == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++r == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++i == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0,
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let n = e * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null,
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let n = e == 'start' ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  Ha = '!';
var Wd = (() => {
  class t extends Ba {
    static ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = cr(t)))(i || t);
      };
    })();
    static ɵcmp = L({
      type: t,
      selectors: [['TimesIcon']],
      standalone: !0,
      features: [Ui, q],
      decls: 2,
      vars: 5,
      consts: [
        [
          'width',
          '14',
          'height',
          '14',
          'viewBox',
          '0 0 14 14',
          'fill',
          'none',
          'xmlns',
          'http://www.w3.org/2000/svg',
        ],
        [
          'd',
          'M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z',
          'fill',
          'currentColor',
        ],
      ],
      template: function (r, i) {
        r & 1 && (xn(), w(0, 'svg', 0), W(1, 'path', 1), E()),
          r & 2 &&
            ($t(i.getClassNames()),
            ue('aria-label', i.ariaLabel)('aria-hidden', i.ariaHidden)(
              'role',
              i.role,
            ));
      },
      encapsulation: 2,
    });
  }
  return t;
})();
var ST = ['*'],
  TT = (t, e, n, r, i, o) => ({
    'p-sidebar': !0,
    'p-sidebar-active': t,
    'p-sidebar-left': e,
    'p-sidebar-right': n,
    'p-sidebar-top': r,
    'p-sidebar-bottom': i,
    'p-sidebar-full': o,
  }),
  MT = (t, e) => ({ transform: t, transition: e }),
  AT = (t) => ({ value: 'visible', params: t });
function xT(t, e) {
  t & 1 && Ze(0);
}
function NT(t, e) {
  if ((t & 1 && (pe(0), S(1, xT, 1, 0, 'ng-container', 5), he()), t & 2)) {
    let n = P(2);
    y(), m('ngTemplateOutlet', n.headlessTemplate);
  }
}
function RT(t, e) {
  t & 1 && Ze(0);
}
function OT(t, e) {
  t & 1 && W(0, 'TimesIcon', 13),
    t & 2 &&
      (m('styleClass', 'p-sidebar-close-icon'),
      ue('data-pc-section', 'closeicon'));
}
function PT(t, e) {}
function FT(t, e) {
  t & 1 && S(0, PT, 0, 0, 'ng-template');
}
function LT(t, e) {
  if ((t & 1 && (w(0, 'span', 14), S(1, FT, 1, 0, null, 5), E()), t & 2)) {
    let n = P(4);
    ue('data-pc-section', 'closeicon'),
      y(),
      m('ngTemplateOutlet', n.closeIconTemplate);
  }
}
function kT(t, e) {
  if (t & 1) {
    let n = Su();
    w(0, 'button', 10),
      st('click', function (i) {
        qr(n);
        let o = P(3);
        return Gr(o.close(i));
      })('keydown.enter', function (i) {
        qr(n);
        let o = P(3);
        return Gr(o.close(i));
      }),
      S(1, OT, 1, 2, 'TimesIcon', 11)(2, LT, 2, 2, 'span', 12),
      E();
  }
  if (t & 2) {
    let n = P(3);
    ue('aria-label', n.ariaCloseLabel)('data-pc-section', 'closebutton')(
      'data-pc-group-section',
      'iconcontainer',
    ),
      y(),
      m('ngIf', !n.closeIconTemplate),
      y(),
      m('ngIf', n.closeIconTemplate);
  }
}
function jT(t, e) {
  t & 1 && Ze(0);
}
function BT(t, e) {
  t & 1 && Ze(0);
}
function VT(t, e) {
  if (
    (t & 1 &&
      (pe(0), w(1, 'div', 15), S(2, BT, 1, 0, 'ng-container', 5), E(), he()),
    t & 2)
  ) {
    let n = P(3);
    y(),
      ue('data-pc-section', 'footer'),
      y(),
      m('ngTemplateOutlet', n.footerTemplate);
  }
}
function UT(t, e) {
  if (
    (t & 1 &&
      (w(0, 'div', 6),
      S(1, RT, 1, 0, 'ng-container', 5)(2, kT, 3, 5, 'button', 7),
      E(),
      w(3, 'div', 8),
      at(4),
      S(5, jT, 1, 0, 'ng-container', 5),
      E(),
      S(6, VT, 3, 2, 'ng-container', 9)),
    t & 2)
  ) {
    let n = P(2);
    ue('data-pc-section', 'header'),
      y(),
      m('ngTemplateOutlet', n.headerTemplate),
      y(),
      m('ngIf', n.showCloseIcon),
      y(),
      ue('data-pc-section', 'content'),
      y(2),
      m('ngTemplateOutlet', n.contentTemplate),
      y(),
      m('ngIf', n.footerTemplate);
  }
}
function HT(t, e) {
  if (t & 1) {
    let n = Su();
    w(0, 'div', 3, 0),
      st('@panelState.start', function (i) {
        qr(n);
        let o = P();
        return Gr(o.onAnimationStart(i));
      })('@panelState.done', function (i) {
        qr(n);
        let o = P();
        return Gr(o.onAnimationEnd(i));
      })('keydown', function (i) {
        qr(n);
        let o = P();
        return Gr(o.onKeyDown(i));
      }),
      S(2, NT, 2, 1, 'ng-container', 4)(
        3,
        UT,
        7,
        6,
        'ng-template',
        null,
        1,
        Xe,
      ),
      E();
  }
  if (t & 2) {
    let n = Je(4),
      r = P();
    $t(r.styleClass),
      m(
        'ngClass',
        fm(
          9,
          TT,
          r.visible,
          r.position === 'left' && !r.fullScreen,
          r.position === 'right' && !r.fullScreen,
          r.position === 'top' && !r.fullScreen,
          r.position === 'bottom' && !r.fullScreen,
          r.fullScreen,
        ),
      )(
        '@panelState',
        Kt(19, AT, dm(16, MT, r.transformOptions, r.transitionOptions)),
      )('ngStyle', r.style),
      ue('data-pc-name', 'sidebar')('data-pc-section', 'root'),
      y(2),
      m('ngIf', r.headlessTemplate)('ngIfElse', n);
  }
}
var $T = $d([
    fi({ transform: '{{transform}}', opacity: 0 }),
    Ud('{{transition}}'),
  ]),
  zT = $d([
    Ud('{{transition}}', fi({ transform: '{{transform}}', opacity: 0 })),
  ]),
  cy = (() => {
    class t {
      document;
      el;
      renderer;
      cd;
      config;
      appendTo;
      blockScroll = !1;
      style;
      styleClass;
      ariaCloseLabel;
      autoZIndex = !0;
      baseZIndex = 0;
      modal = !0;
      dismissible = !0;
      showCloseIcon = !0;
      closeOnEscape = !0;
      transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
      get visible() {
        return this._visible;
      }
      set visible(n) {
        this._visible = n;
      }
      get position() {
        return this._position;
      }
      set position(n) {
        switch (((this._position = n), n)) {
          case 'left':
            this.transformOptions = 'translate3d(-100%, 0px, 0px)';
            break;
          case 'right':
            this.transformOptions = 'translate3d(100%, 0px, 0px)';
            break;
          case 'bottom':
            this.transformOptions = 'translate3d(0px, 100%, 0px)';
            break;
          case 'top':
            this.transformOptions = 'translate3d(0px, -100%, 0px)';
            break;
        }
      }
      get fullScreen() {
        return this._fullScreen;
      }
      set fullScreen(n) {
        (this._fullScreen = n), n && (this.transformOptions = 'none');
      }
      templates;
      onShow = new Ce();
      onHide = new Ce();
      visibleChange = new Ce();
      initialized;
      _visible;
      _position = 'left';
      _fullScreen = !1;
      container;
      transformOptions = 'translate3d(-100%, 0px, 0px)';
      mask;
      maskClickListener;
      documentEscapeListener;
      animationEndListener;
      contentTemplate;
      headerTemplate;
      footerTemplate;
      closeIconTemplate;
      headlessTemplate;
      constructor(n, r, i, o, s) {
        (this.document = n),
          (this.el = r),
          (this.renderer = i),
          (this.cd = o),
          (this.config = s);
      }
      ngAfterViewInit() {
        this.initialized = !0;
      }
      ngAfterContentInit() {
        this.templates?.forEach((n) => {
          switch (n.getType()) {
            case 'content':
              this.contentTemplate = n.template;
              break;
            case 'header':
              this.headerTemplate = n.template;
              break;
            case 'footer':
              this.footerTemplate = n.template;
              break;
            case 'closeicon':
              this.closeIconTemplate = n.template;
              break;
            case 'headless':
              this.headlessTemplate = n.template;
              break;
            default:
              this.contentTemplate = n.template;
              break;
          }
        });
      }
      onKeyDown(n) {
        n.code === 'Escape' && this.hide(!1);
      }
      show() {
        this.autoZIndex &&
          Eo.set(
            'modal',
            this.container,
            this.baseZIndex || this.config.zIndex.modal,
          ),
          this.modal && this.enableModality(),
          this.onShow.emit({}),
          this.visibleChange.emit(!0);
      }
      hide(n = !0) {
        n && this.onHide.emit({}), this.modal && this.disableModality();
      }
      close(n) {
        this.hide(), this.visibleChange.emit(!1), n.preventDefault();
      }
      enableModality() {
        this.mask ||
          ((this.mask = this.renderer.createElement('div')),
          this.renderer.setStyle(
            this.mask,
            'zIndex',
            String(parseInt(this.container.style.zIndex) - 1),
          ),
          ie.addMultipleClasses(
            this.mask,
            'p-component-overlay p-sidebar-mask p-component-overlay p-component-overlay-enter',
          ),
          this.dismissible &&
            (this.maskClickListener = this.renderer.listen(
              this.mask,
              'click',
              (n) => {
                this.dismissible && this.close(n);
              },
            )),
          this.renderer.appendChild(this.document.body, this.mask),
          this.blockScroll && ie.blockBodyScroll());
      }
      disableModality() {
        this.mask &&
          (ie.addClass(this.mask, 'p-component-overlay-leave'),
          (this.animationEndListener = this.renderer.listen(
            this.mask,
            'animationend',
            this.destroyModal.bind(this),
          )));
      }
      destroyModal() {
        this.unbindMaskClickListener(),
          this.mask && this.renderer.removeChild(this.document.body, this.mask),
          this.blockScroll && ie.unblockBodyScroll(),
          this.unbindAnimationEndListener(),
          (this.mask = null);
      }
      onAnimationStart(n) {
        switch (n.toState) {
          case 'visible':
            (this.container = n.element),
              this.appendContainer(),
              this.show(),
              this.closeOnEscape && this.bindDocumentEscapeListener();
            break;
        }
      }
      onAnimationEnd(n) {
        switch (n.toState) {
          case 'void':
            this.hide(!1),
              Eo.clear(this.container),
              this.unbindGlobalListeners();
            break;
        }
      }
      appendContainer() {
        this.appendTo &&
          (this.appendTo === 'body'
            ? this.renderer.appendChild(this.document.body, this.container)
            : ie.appendChild(this.container, this.appendTo));
      }
      bindDocumentEscapeListener() {
        let n = this.el ? this.el.nativeElement.ownerDocument : this.document;
        this.documentEscapeListener = this.renderer.listen(
          n,
          'keydown',
          (r) => {
            r.which == 27 &&
              parseInt(this.container.style.zIndex) ===
                Eo.get(this.container) &&
              this.close(r);
          },
        );
      }
      unbindDocumentEscapeListener() {
        this.documentEscapeListener &&
          (this.documentEscapeListener(), (this.documentEscapeListener = null));
      }
      unbindMaskClickListener() {
        this.maskClickListener &&
          (this.maskClickListener(), (this.maskClickListener = null));
      }
      unbindGlobalListeners() {
        this.unbindMaskClickListener(), this.unbindDocumentEscapeListener();
      }
      unbindAnimationEndListener() {
        this.animationEndListener &&
          this.mask &&
          (this.animationEndListener(), (this.animationEndListener = null));
      }
      ngOnDestroy() {
        (this.initialized = !1),
          this.visible && this.modal && this.destroyModal(),
          this.appendTo &&
            this.container &&
            this.renderer.appendChild(this.el.nativeElement, this.container),
          this.container && this.autoZIndex && Eo.clear(this.container),
          (this.container = null),
          this.unbindGlobalListeners(),
          this.unbindAnimationEndListener();
      }
      static ɵfac = function (r) {
        return new (r || t)(b(de), b(we), b(Nt), b(Rn), b(ja));
      };
      static ɵcmp = L({
        type: t,
        selectors: [['p-sidebar']],
        contentQueries: function (r, i, o) {
          if ((r & 1 && zt(o, di, 4), r & 2)) {
            let s;
            Wt((s = qt())) && (i.templates = s);
          }
        },
        hostAttrs: [1, 'p-element'],
        inputs: {
          appendTo: 'appendTo',
          blockScroll: [
            j.HasDecoratorInputTransform,
            'blockScroll',
            'blockScroll',
            re,
          ],
          style: 'style',
          styleClass: 'styleClass',
          ariaCloseLabel: 'ariaCloseLabel',
          autoZIndex: [
            j.HasDecoratorInputTransform,
            'autoZIndex',
            'autoZIndex',
            re,
          ],
          baseZIndex: [
            j.HasDecoratorInputTransform,
            'baseZIndex',
            'baseZIndex',
            zi,
          ],
          modal: [j.HasDecoratorInputTransform, 'modal', 'modal', re],
          dismissible: [
            j.HasDecoratorInputTransform,
            'dismissible',
            'dismissible',
            re,
          ],
          showCloseIcon: [
            j.HasDecoratorInputTransform,
            'showCloseIcon',
            'showCloseIcon',
            re,
          ],
          closeOnEscape: [
            j.HasDecoratorInputTransform,
            'closeOnEscape',
            'closeOnEscape',
            re,
          ],
          transitionOptions: 'transitionOptions',
          visible: 'visible',
          position: 'position',
          fullScreen: 'fullScreen',
        },
        outputs: {
          onShow: 'onShow',
          onHide: 'onHide',
          visibleChange: 'visibleChange',
        },
        features: [Dt],
        ngContentSelectors: ST,
        decls: 1,
        vars: 1,
        consts: [
          ['container', ''],
          ['notHeadless', ''],
          [
            'role',
            'complementary',
            3,
            'ngClass',
            'ngStyle',
            'class',
            'keydown',
            4,
            'ngIf',
          ],
          ['role', 'complementary', 3, 'keydown', 'ngClass', 'ngStyle'],
          [4, 'ngIf', 'ngIfElse'],
          [4, 'ngTemplateOutlet'],
          [1, 'p-sidebar-header'],
          [
            'type',
            'button',
            'class',
            'p-sidebar-close p-sidebar-icon p-link',
            'pRipple',
            '',
            3,
            'click',
            'keydown.enter',
            4,
            'ngIf',
          ],
          [1, 'p-sidebar-content'],
          [4, 'ngIf'],
          [
            'type',
            'button',
            'pRipple',
            '',
            1,
            'p-sidebar-close',
            'p-sidebar-icon',
            'p-link',
            3,
            'click',
            'keydown.enter',
          ],
          [3, 'styleClass', 4, 'ngIf'],
          ['class', 'p-sidebar-close-icon', 4, 'ngIf'],
          [3, 'styleClass'],
          [1, 'p-sidebar-close-icon'],
          [1, 'p-sidebar-footer'],
        ],
        template: function (r, i) {
          r & 1 && (Rt(), S(0, HT, 5, 21, 'div', 2)),
            r & 2 && m('ngIf', i.visible);
        },
        dependencies: () => [On, De, ti, Pn, Va, Wd],
        styles: [
          `@layer primeng{.p-sidebar{position:fixed;transition:transform .3s;display:flex;flex-direction:column}.p-sidebar-content{position:relative;overflow-y:auto;flex-grow:1}.p-sidebar-header{display:flex;align-items:center}.p-sidebar-footer{margin-top:auto}.p-sidebar-icon{display:flex;align-items:center;justify-content:center;margin-left:auto}.p-sidebar-left{top:0;left:0;width:20rem;height:100%}.p-sidebar-right{top:0;right:0;width:20rem;height:100%}.p-sidebar-top{top:0;left:0;width:100%;height:10rem}.p-sidebar-bottom{bottom:0;left:0;width:100%;height:10rem}.p-sidebar-full{width:100%;height:100%;top:0;left:0;-webkit-transition:none;transition:none}.p-sidebar-left.p-sidebar-sm,.p-sidebar-right.p-sidebar-sm{width:20rem}.p-sidebar-left.p-sidebar-md,.p-sidebar-right.p-sidebar-md{width:40rem}.p-sidebar-left.p-sidebar-lg,.p-sidebar-right.p-sidebar-lg{width:60rem}.p-sidebar-top.p-sidebar-sm,.p-sidebar-bottom.p-sidebar-sm{height:10rem}.p-sidebar-top.p-sidebar-md,.p-sidebar-bottom.p-sidebar-md{height:20rem}.p-sidebar-top.p-sidebar-lg,.p-sidebar-bottom.p-sidebar-lg{height:30rem}@media screen and (max-width: 64em){.p-sidebar-left.p-sidebar-lg,.p-sidebar-left.p-sidebar-md,.p-sidebar-right.p-sidebar-lg,.p-sidebar-right.p-sidebar-md{width:20rem}}}
`,
        ],
        encapsulation: 2,
        data: {
          animation: [
            ay('panelState', [
              Hd('void => visible', [zd($T)]),
              Hd('visible => void', [zd(zT)]),
            ]),
          ],
        },
        changeDetection: 0,
      });
    }
    return t;
  })(),
  uy = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵmod = Ie({ type: t });
      static ɵinj = _e({ imports: [le, Qv, pr, Wd, pr] });
    }
    return t;
  })();
var dy = [
  { routeName: 'NowPlaying', routePath: 'now-playing' },
  { routeName: 'Popular', routePath: 'popular' },
  { routeName: 'TopRate', routePath: 'top-rate' },
  { routeName: 'Upcoming', routePath: 'upcoming' },
];
function qT(t, e) {
  if ((t & 1 && (w(0, 'li', 7)(1, 'a', 8)(2, 'span'), B(3), E()()()), t & 2)) {
    let n = e.$implicit;
    y(), m('routerLink', n.routePath), y(2), lt(n.routeName);
  }
}
var fy = (() => {
  let e = class e {
    constructor() {
      (this.sidebarVisible = !0), (this.sidebarLinks = dy);
    }
    showSidebar() {
      this.sidebarVisible = !0;
    }
    trackByRoutePath(r, i) {
      return i.routePath;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-sidebar']],
      standalone: !0,
      features: [q],
      decls: 9,
      vars: 3,
      consts: [
        [3, 'visibleChange', 'visible'],
        [1, 'sidebar'],
        [1, 'logo'],
        ['src', '#', 'alt', 'logo'],
        [1, 'sidebar__list'],
        ['class', 'sidebar__item', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [
          'type',
          'button',
          'pButton',
          '',
          'label',
          'Menu',
          'icon',
          'pi pi-bars',
          3,
          'click',
        ],
        [1, 'sidebar__item'],
        [
          'routerLinkActive',
          'sidebar__link_active',
          1,
          'sidebar__link',
          3,
          'routerLink',
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (w(0, 'p-sidebar', 0),
          xu('visibleChange', function (a) {
            return um(o.sidebarVisible, a) || (o.sidebarVisible = a), a;
          }),
          w(1, 'aside', 1)(2, 'div', 2),
          W(3, 'img', 3),
          w(4, 'p'),
          B(
            5,
            '\u044F\u043A\u0430\u0441\u044C \u043A\u0440\u0443\u0442\u0430 \u043D\u0430\u0437\u0432\u0430',
          ),
          E()(),
          w(6, 'ul', 4),
          S(7, qT, 4, 2, 'li', 5),
          E()()(),
          w(8, 'p-button', 6),
          st('click', function () {
            return o.showSidebar();
          }),
          E()),
          i & 2 &&
            (Au('visible', o.sidebarVisible),
            y(7),
            m('ngForOf', o.sidebarLinks)('ngForTrackBy', o.trackByRoutePath));
      },
      dependencies: [le, He, uy, cy, Ua, Zv, Co, La, jn, Fa],
    }));
  let t = e;
  return t;
})();
var py = (() => {
  let e = class e {
    constructor(r) {
      (this.movieService = r), (this.title = 'first');
    }
    ngOnInit() {
      this.movieService.getMovies();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [q],
      decls: 4,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
          (W(0, 'app-sidebar')(1, 'app-header'),
          w(2, 'main'),
          W(3, 'router-outlet'),
          E());
      },
      dependencies: [le, La, Od, fy, iy],
    }));
  let t = e;
  return t;
})();
function hy(t) {
  return new v(3e3, !1);
}
function GT() {
  return new v(3100, !1);
}
function KT() {
  return new v(3101, !1);
}
function QT(t) {
  return new v(3001, !1);
}
function YT(t) {
  return new v(3003, !1);
}
function ZT(t) {
  return new v(3004, !1);
}
function JT(t, e) {
  return new v(3005, !1);
}
function XT() {
  return new v(3006, !1);
}
function eM() {
  return new v(3007, !1);
}
function tM(t, e) {
  return new v(3008, !1);
}
function nM(t) {
  return new v(3002, !1);
}
function rM(t, e, n, r, i) {
  return new v(3010, !1);
}
function iM() {
  return new v(3011, !1);
}
function oM() {
  return new v(3012, !1);
}
function sM() {
  return new v(3200, !1);
}
function aM() {
  return new v(3202, !1);
}
function lM() {
  return new v(3013, !1);
}
function cM(t) {
  return new v(3014, !1);
}
function uM(t) {
  return new v(3015, !1);
}
function dM(t) {
  return new v(3016, !1);
}
function fM(t, e) {
  return new v(3404, !1);
}
function pM(t) {
  return new v(3502, !1);
}
function hM(t) {
  return new v(3503, !1);
}
function gM() {
  return new v(3300, !1);
}
function mM(t) {
  return new v(3504, !1);
}
function vM(t) {
  return new v(3301, !1);
}
function yM(t, e) {
  return new v(3302, !1);
}
function wM(t) {
  return new v(3303, !1);
}
function DM(t, e) {
  return new v(3400, !1);
}
function EM(t) {
  return new v(3401, !1);
}
function CM(t) {
  return new v(3402, !1);
}
function bM(t, e) {
  return new v(3505, !1);
}
function Hn(t) {
  switch (t.length) {
    case 0:
      return new Un();
    case 1:
      return t[0];
    default:
      return new bo(t);
  }
}
function My(t, e, n = new Map(), r = new Map()) {
  let i = [],
    o = [],
    s = -1,
    a = null;
  if (
    (e.forEach((l) => {
      let c = l.get('offset'),
        u = c == s,
        d = (u && a) || new Map();
      l.forEach((f, p) => {
        let h = p,
          g = f;
        if (p !== 'offset')
          switch (((h = t.normalizePropertyName(h, i)), g)) {
            case Ha:
              g = n.get(p);
              break;
            case Jt:
              g = r.get(p);
              break;
            default:
              g = t.normalizeStyleValue(p, h, g, i);
              break;
          }
        d.set(h, g);
      }),
        u || o.push(d),
        (a = d),
        (s = c);
    }),
    i.length)
  )
    throw pM(i);
  return o;
}
function gf(t, e, n, r) {
  switch (e) {
    case 'start':
      t.onStart(() => r(n && qd(n, 'start', t)));
      break;
    case 'done':
      t.onDone(() => r(n && qd(n, 'done', t)));
      break;
    case 'destroy':
      t.onDestroy(() => r(n && qd(n, 'destroy', t)));
      break;
  }
}
function qd(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    o = mf(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i,
    ),
    s = t._data;
  return s != null && (o._data = s), o;
}
function mf(t, e, n, r, i = '', o = 0, s) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: o,
    disabled: !!s,
  };
}
function pt(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function gy(t) {
  let e = t.indexOf(':'),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var _M = typeof document > 'u' ? null : document.documentElement;
function vf(t) {
  let e = t.parentNode || t.host || null;
  return e === _M ? null : e;
}
function IM(t) {
  return t.substring(1, 6) == 'ebkit';
}
var hr = null,
  my = !1;
function SM(t) {
  hr ||
    ((hr = TM() || {}), (my = hr.style ? 'WebkitAppearance' in hr.style : !1));
  let e = !0;
  return (
    hr.style &&
      !IM(t) &&
      ((e = t in hr.style),
      !e &&
        my &&
        (e = 'Webkit' + t.charAt(0).toUpperCase() + t.slice(1) in hr.style)),
    e
  );
}
function TM() {
  return typeof document < 'u' ? document.body : null;
}
function Ay(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = vf(e);
  }
  return !1;
}
function xy(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var yf = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return SM(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return Ay(r, i);
      }
      getParentElement(r) {
        return vf(r);
      }
      query(r, i, o) {
        return xy(r, i, o);
      }
      computeStyle(r, i, o) {
        return o || '';
      }
      animate(r, i, o, s, a, l = [], c) {
        return new Un(o, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = I({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Cf = class Cf {};
Cf.NOOP = new yf();
var vr = Cf,
  yr = class {};
var MM = 1e3,
  Ny = '{{',
  AM = '}}',
  Ry = 'ng-enter',
  Jd = 'ng-leave',
  $a = 'ng-trigger',
  Ka = '.ng-trigger',
  vy = 'ng-animating',
  Xd = '.ng-animating';
function mn(t) {
  if (typeof t == 'number') return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : ef(parseFloat(e[1]), e[2]);
}
function ef(t, e) {
  switch (e) {
    case 's':
      return t * MM;
    default:
      return t;
  }
}
function Qa(t, e, n) {
  return t.hasOwnProperty('duration') ? t : xM(t, e, n);
}
function xM(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    o = 0,
    s = '';
  if (typeof t == 'string') {
    let a = t.match(r);
    if (a === null) return e.push(hy(t)), { duration: 0, delay: 0, easing: '' };
    i = ef(parseFloat(a[1]), a[2]);
    let l = a[3];
    l != null && (o = ef(parseFloat(l), a[4]));
    let c = a[5];
    c && (s = c);
  } else i = t;
  if (!n) {
    let a = !1,
      l = e.length;
    i < 0 && (e.push(GT()), (a = !0)),
      o < 0 && (e.push(KT()), (a = !0)),
      a && e.splice(l, 0, hy(t));
  }
  return { duration: i, delay: o, easing: s };
}
function NM(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function Xt(t, e, n) {
  e.forEach((r, i) => {
    let o = wf(i);
    n && !n.has(i) && n.set(i, t.style[o]), (t.style[o] = r);
  });
}
function mr(t, e) {
  e.forEach((n, r) => {
    let i = wf(r);
    t.style[i] = '';
  });
}
function _o(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : ly(t)) : t;
}
function RM(t, e, n) {
  let r = e.params || {},
    i = Oy(t);
  i.length &&
    i.forEach((o) => {
      r.hasOwnProperty(o) || n.push(QT(o));
    });
}
var tf = new RegExp(`${Ny}\\s*(.+?)\\s*${AM}`, 'g');
function Oy(t) {
  let e = [];
  if (typeof t == 'string') {
    let n;
    for (; (n = tf.exec(t)); ) e.push(n[1]);
    tf.lastIndex = 0;
  }
  return e;
}
function So(t, e, n) {
  let r = `${t}`,
    i = r.replace(tf, (o, s) => {
      let a = e[s];
      return a == null && (n.push(YT(s)), (a = '')), a.toString();
    });
  return i == r ? t : i;
}
var OM = /-+([a-z0-9])/g;
function wf(t) {
  return t.replace(OM, (...e) => e[1].toUpperCase());
}
function PM(t, e) {
  return t === 0 || e === 0;
}
function FM(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((o, s) => {
        r.has(s) || i.push(s), r.set(s, o);
      }),
      i.length)
    )
      for (let o = 1; o < e.length; o++) {
        let s = e[o];
        i.forEach((a) => s.set(a, Df(t, a)));
      }
  }
  return e;
}
function ft(t, e, n) {
  switch (e.type) {
    case k.Trigger:
      return t.visitTrigger(e, n);
    case k.State:
      return t.visitState(e, n);
    case k.Transition:
      return t.visitTransition(e, n);
    case k.Sequence:
      return t.visitSequence(e, n);
    case k.Group:
      return t.visitGroup(e, n);
    case k.Animate:
      return t.visitAnimate(e, n);
    case k.Keyframes:
      return t.visitKeyframes(e, n);
    case k.Style:
      return t.visitStyle(e, n);
    case k.Reference:
      return t.visitReference(e, n);
    case k.AnimateChild:
      return t.visitAnimateChild(e, n);
    case k.AnimateRef:
      return t.visitAnimateRef(e, n);
    case k.Query:
      return t.visitQuery(e, n);
    case k.Stagger:
      return t.visitStagger(e, n);
    default:
      throw ZT(e.type);
  }
}
function Df(t, e) {
  return window.getComputedStyle(t)[e];
}
var LM = new Set([
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'left',
    'top',
    'bottom',
    'right',
    'fontSize',
    'outlineWidth',
    'outlineOffset',
    'paddingTop',
    'paddingLeft',
    'paddingBottom',
    'paddingRight',
    'marginTop',
    'marginLeft',
    'marginBottom',
    'marginRight',
    'borderRadius',
    'borderWidth',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'textIndent',
    'perspective',
  ]),
  Ya = class extends yr {
    normalizePropertyName(e, n) {
      return wf(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let o = '',
        s = r.toString().trim();
      if (LM.has(n) && r !== 0 && r !== '0')
        if (typeof r == 'number') o = 'px';
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(JT(e, r));
        }
      return s + o;
    }
  };
var Za = '*';
function kM(t, e) {
  let n = [];
  return (
    typeof t == 'string'
      ? t.split(/\s*,\s*/).forEach((r) => jM(r, n, e))
      : n.push(t),
    n
  );
}
function jM(t, e, n) {
  if (t[0] == ':') {
    let l = BM(t, n);
    if (typeof l == 'function') {
      e.push(l);
      return;
    }
    t = l;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(uM(t)), e;
  let i = r[1],
    o = r[2],
    s = r[3];
  e.push(yy(i, s));
  let a = i == Za && s == Za;
  o[0] == '<' && !a && e.push(yy(s, i));
}
function BM(t, e) {
  switch (t) {
    case ':enter':
      return 'void => *';
    case ':leave':
      return '* => void';
    case ':increment':
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ':decrement':
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return e.push(dM(t)), '* => *';
  }
}
var za = new Set(['true', '1']),
  Wa = new Set(['false', '0']);
function yy(t, e) {
  let n = za.has(t) || Wa.has(t),
    r = za.has(e) || Wa.has(e);
  return (i, o) => {
    let s = t == Za || t == i,
      a = e == Za || e == o;
    return (
      !s && n && typeof i == 'boolean' && (s = i ? za.has(t) : Wa.has(t)),
      !a && r && typeof o == 'boolean' && (a = o ? za.has(e) : Wa.has(e)),
      s && a
    );
  };
}
var Py = ':self',
  VM = new RegExp(`s*${Py}s*,?`, 'g');
function Fy(t, e, n, r) {
  return new nf(t).build(e, n, r);
}
var wy = '',
  nf = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new rf(n);
      return this._resetContextStyleTimingState(i), ft(this, _o(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = wy),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(wy, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        o = [],
        s = [];
      return (
        e.name.charAt(0) == '@' && n.errors.push(XT()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == k.State)) {
            let l = a,
              c = l.name;
            c
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (l.name = u), o.push(this.visitState(l, n));
              }),
              (l.name = c);
          } else if (a.type == k.Transition) {
            let l = this.visitTransition(a, n);
            (r += l.queryCount), (i += l.depCount), s.push(l);
          } else n.errors.push(eM());
        }),
        {
          type: k.Trigger,
          name: e.name,
          states: o,
          transitions: s,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, n) {
      let r = this.visitStyle(e.styles, n),
        i = (e.options && e.options.params) || null;
      if (r.containsDynamicStyles) {
        let o = new Set(),
          s = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((l) => {
              Oy(l).forEach((c) => {
                s.hasOwnProperty(c) || o.add(c);
              });
            });
        }),
          o.size && n.errors.push(tM(e.name, [...o.values()]));
      }
      return {
        type: k.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = ft(this, _o(e.animation), n),
        i = kM(e.expr, n.errors);
      return {
        type: k.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: gr(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: k.Sequence,
        steps: e.steps.map((r) => ft(this, r, n)),
        options: gr(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        o = e.steps.map((s) => {
          n.currentTime = r;
          let a = ft(this, s, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i), { type: k.Group, steps: o, options: gr(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = zM(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        o = e.styles ? e.styles : fi({});
      if (o.type == k.Keyframes) i = this.visitKeyframes(o, n);
      else {
        let s = e.styles,
          a = !1;
        if (!s) {
          a = !0;
          let c = {};
          r.easing && (c.easing = r.easing), (s = fi(c));
        }
        n.currentTime += r.duration + r.delay;
        let l = this.visitStyle(s, n);
        (l.isEmptyStep = a), (i = l);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: k.Animate, timings: r, style: i, options: null }
      );
    }
    visitStyle(e, n) {
      let r = this._makeStyleAst(e, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(e, n) {
      let r = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == 'string'
          ? a === Jt
            ? r.push(a)
            : n.errors.push(nM(a))
          : r.push(new Map(Object.entries(a)));
      let o = !1,
        s = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has('easing') && ((s = a.get('easing')), a.delete('easing')), !o)
          ) {
            for (let l of a.values())
              if (l.toString().indexOf(Ny) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: k.Style,
          styles: r,
          easing: s,
          offset: e.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        o = n.currentTime;
      r && o > 0 && (o -= r.duration + r.delay),
        e.styles.forEach((s) => {
          typeof s != 'string' &&
            s.forEach((a, l) => {
              let c = n.collectedStyles.get(n.currentQuerySelector),
                u = c.get(l),
                d = !0;
              u &&
                (o != i &&
                  o >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(rM(l, u.startTime, u.endTime, o, i)),
                  (d = !1)),
                (o = u.startTime)),
                d && c.set(l, { startTime: o, endTime: i }),
                n.options && RM(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: k.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(iM()), r;
      let i = 1,
        o = 0,
        s = [],
        a = !1,
        l = !1,
        c = 0,
        u = e.steps.map((A) => {
          let $ = this._makeStyleAst(A, n),
            J = $.offset != null ? $.offset : $M($.styles),
            ee = 0;
          return (
            J != null && (o++, (ee = $.offset = J)),
            (l = l || ee < 0 || ee > 1),
            (a = a || ee < c),
            (c = ee),
            s.push(ee),
            $
          );
        });
      l && n.errors.push(oM()), a && n.errors.push(sM());
      let d = e.steps.length,
        f = 0;
      o > 0 && o < d ? n.errors.push(aM()) : o == 0 && (f = i / (d - 1));
      let p = d - 1,
        h = n.currentTime,
        g = n.currentAnimateTimings,
        M = g.duration;
      return (
        u.forEach((A, $) => {
          let J = f > 0 ? ($ == p ? 1 : f * $) : s[$],
            ee = J * M;
          (n.currentTime = h + g.delay + ee),
            (g.duration = ee),
            this._validateStyleAst(A, n),
            (A.offset = J),
            r.styles.push(A);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: k.Reference,
        animation: ft(this, _o(e.animation), n),
        options: gr(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: k.AnimateChild, options: gr(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: k.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: gr(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [o, s] = UM(e.selector);
      (n.currentQuerySelector = r.length ? r + ' ' + o : o),
        pt(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = ft(this, _o(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: k.Query,
          selector: o,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: s,
          animation: a,
          originalSelector: e.selector,
          options: gr(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(lM());
      let r =
        e.timings === 'full'
          ? { duration: 0, delay: 0, easing: 'full' }
          : Qa(e.timings, n.errors, !0);
      return {
        type: k.Stagger,
        animation: ft(this, _o(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function UM(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == Py);
  return (
    e && (t = t.replace(VM, '')),
    (t = t
      .replace(/@\*/g, Ka)
      .replace(/@\w+/g, (n) => Ka + '-' + n.slice(1))
      .replace(/:animating/g, Xd)),
    [t, e]
  );
}
function HM(t) {
  return t ? C({}, t) : null;
}
var rf = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function $M(t) {
  if (typeof t == 'string') return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((n) => {
      if (n instanceof Map && n.has('offset')) {
        let r = n;
        (e = parseFloat(r.get('offset'))), r.delete('offset');
      }
    });
  else if (t instanceof Map && t.has('offset')) {
    let n = t;
    (e = parseFloat(n.get('offset'))), n.delete('offset');
  }
  return e;
}
function zM(t, e) {
  if (t.hasOwnProperty('duration')) return t;
  if (typeof t == 'number') {
    let o = Qa(t, e).duration;
    return Gd(o, 0, '');
  }
  let n = t;
  if (n.split(/\s+/).some((o) => o.charAt(0) == '{' && o.charAt(1) == '{')) {
    let o = Gd(0, 0, '');
    return (o.dynamic = !0), (o.strValue = n), o;
  }
  let i = Qa(n, e);
  return Gd(i.duration, i.delay, i.easing);
}
function gr(t) {
  return (
    t ? ((t = C({}, t)), t.params && (t.params = HM(t.params))) : (t = {}), t
  );
}
function Gd(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function Ef(t, e, n, r, i, o, s = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: o,
    totalTime: i + o,
    easing: s,
    subTimeline: a,
  };
}
var To = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, n) {
      let r = this._map.get(e);
      r || this._map.set(e, (r = [])), r.push(...n);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  WM = 1,
  qM = ':enter',
  GM = new RegExp(qM, 'g'),
  KM = ':leave',
  QM = new RegExp(KM, 'g');
function Ly(t, e, n, r, i, o = new Map(), s = new Map(), a, l, c = []) {
  return new of().buildKeyframes(t, e, n, r, i, o, s, a, l, c);
}
var of = class {
    buildKeyframes(e, n, r, i, o, s, a, l, c, u = []) {
      c = c || new To();
      let d = new sf(e, n, c, i, o, u, []);
      d.options = l;
      let f = l.delay ? mn(l.delay) : 0;
      d.currentTimeline.delayNextStep(f),
        d.currentTimeline.setStyles([s], null, d.errors, l),
        ft(this, r, d);
      let p = d.timelines.filter((h) => h.containsAnimation());
      if (p.length && a.size) {
        let h;
        for (let g = p.length - 1; g >= 0; g--) {
          let M = p[g];
          if (M.element === n) {
            h = M;
            break;
          }
        }
        h &&
          !h.allowOnlyTimelineStyles() &&
          h.setStyles([a], null, d.errors, l);
      }
      return p.length
        ? p.map((h) => h.buildKeyframes())
        : [Ef(n, [], [], [], 0, f, '', !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          o = n.currentTimeline.currentTime,
          s = this._visitSubInstructions(r, i, i.options);
        o != s && n.transformIntoNewTimeline(s);
      }
      n.previousNode = e;
    }
    visitAnimateRef(e, n) {
      let r = n.createSubContext(e.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], n, r),
        this.visitReference(e.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = e);
    }
    _applyAnimationRefDelays(e, n, r) {
      for (let i of e) {
        let o = i?.delay;
        if (o) {
          let s =
            typeof o == 'number' ? o : mn(So(o, i?.params ?? {}, n.errors));
          r.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let o = n.currentTimeline.currentTime,
        s = r.duration != null ? mn(r.duration) : null,
        a = r.delay != null ? mn(r.delay) : null;
      return (
        s !== 0 &&
          e.forEach((l) => {
            let c = n.appendInstructionToTimeline(l, s, a);
            o = Math.max(o, c.duration + c.delay);
          }),
        o
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        ft(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        o = e.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((i = n.createSubContext(o)),
        i.transformIntoNewTimeline(),
        o.delay != null)
      ) {
        i.previousNode.type == k.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = Ja));
        let s = mn(o.delay);
        i.delayNextStep(s);
      }
      e.steps.length &&
        (e.steps.forEach((s) => ft(this, s, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        o = e.options && e.options.delay ? mn(e.options.delay) : 0;
      e.steps.forEach((s) => {
        let a = n.createSubContext(e.options);
        o && a.delayNextStep(o),
          ft(this, s, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? So(r, n.params, n.errors) : r;
        return Qa(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let o = e.style;
      o.type == k.Keyframes
        ? this.visitKeyframes(o, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(o, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let o = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(o)
        : r.setStyles(e.styles, o, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        o = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((l) => {
          let c = l.offset || 0;
          a.forwardTime(c * o),
            a.setStyles(l.styles, l.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + o),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        o = i.delay ? mn(i.delay) : 0;
      o &&
        (n.previousNode.type === k.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Ja));
      let s = r,
        a = n.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          n.errors,
        );
      n.currentQueryTotal = a.length;
      let l = null;
      a.forEach((c, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(e.options, c);
        o && d.delayNextStep(o),
          c === n.element && (l = d.currentTimeline),
          ft(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let f = d.currentTimeline.currentTime;
        s = Math.max(s, f);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(s),
        l &&
          (n.currentTimeline.mergeTimelineCollectedStyles(l),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        o = e.timings,
        s = Math.abs(o.duration),
        a = s * (n.currentQueryTotal - 1),
        l = s * n.currentQueryIndex;
      switch (o.duration < 0 ? 'reverse' : o.easing) {
        case 'reverse':
          l = a - l;
          break;
        case 'full':
          l = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      l && u.delayNextStep(l);
      let d = u.currentTime;
      ft(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  Ja = {},
  sf = class t {
    constructor(e, n, r, i, o, s, a, l) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = Ja),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = l || new Xa(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = mn(r.duration)),
        r.delay != null && (i.delay = mn(r.delay));
      let o = r.params;
      if (o) {
        let s = i.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!n || !s.hasOwnProperty(a)) && (s[a] = So(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (e.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, n, r) {
      let i = n || this.element,
        o = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0),
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(e),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = Ja),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, n, r) {
      let i = {
          duration: n ?? e.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
          easing: '',
        },
        o = new af(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe,
        );
      return this.timelines.push(o), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, o, s) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(GM, '.' + this._enterClassName)),
          (e = e.replace(QM, '.' + this._leaveClassName));
        let l = r != 1,
          c = this._driver.query(this.element, e, l);
        r !== 0 &&
          (c = r < 0 ? c.slice(c.length + r, c.length) : c.slice(0, r)),
          a.push(...c);
      }
      return !o && a.length == 0 && s.push(cM(n)), a;
    }
  },
  Xa = class t {
    constructor(e, n, r, i) {
      (this._driver = e),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + e),
          n && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, n) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          n || this.currentTime,
          this._elementTimelineStylesLookup,
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += WM), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, n) {
      this._localTimelineStyles.set(e, n),
        this._globalTimelineStyles.set(e, n),
        this._styleSummary.set(e, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set('easing', e);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || Jt), this._currentKeyframe.set(n, Jt);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set('easing', n);
      let o = (i && i.params) || {},
        s = YM(e, this._globalTimelineStyles);
      for (let [a, l] of s) {
        let c = So(l, o, r);
        this._pendingStyles.set(a, c),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Jt),
          this._updateStyle(a, c);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, n) => {
          this._currentKeyframe.set(n, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, n] of this._localTimelineStyles)
        this._pendingStyles.set(e, n), this._updateStyle(e, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let n in this._currentKeyframe) e.push(n);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, l) => {
        let c = new Map([...this._backFill, ...a]);
        c.forEach((u, d) => {
          u === Ha ? e.add(d) : u === Jt && n.add(d);
        }),
          r || c.set('offset', l / this.duration),
          i.push(c);
      });
      let o = [...e.values()],
        s = [...n.values()];
      if (r) {
        let a = i[0],
          l = new Map(a);
        a.set('offset', 0), l.set('offset', 1), (i = [a, l]);
      }
      return Ef(
        this.element,
        i,
        o,
        s,
        this.duration,
        this.startTime,
        this.easing,
        !1,
      );
    }
  },
  af = class extends Xa {
    constructor(e, n, r, i, o, s, a = !1) {
      super(e, n, s.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let o = [],
          s = r + n,
          a = n / s,
          l = new Map(e[0]);
        l.set('offset', 0), o.push(l);
        let c = new Map(e[0]);
        c.set('offset', Dy(a)), o.push(c);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let f = new Map(e[d]),
            p = f.get('offset'),
            h = n + p * r;
          f.set('offset', Dy(h / s)), o.push(f);
        }
        (r = s), (n = 0), (i = ''), (e = o);
      }
      return Ef(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0,
      );
    }
  };
function Dy(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function YM(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === '*') {
        r ??= e.keys();
        for (let o of r) n.set(o, Jt);
      } else for (let [o, s] of i) n.set(o, s);
    }),
    n
  );
}
function Ey(t, e, n, r, i, o, s, a, l, c, u, d, f) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: o,
    toState: r,
    toStyles: s,
    timelines: a,
    queriedElements: l,
    preStyleProps: c,
    postStyleProps: u,
    totalTime: d,
    errors: f,
  };
}
var Kd = {},
  el = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return ZM(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get('*');
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, o, s, a, l, c, u) {
      let d = [],
        f = (this.ast.options && this.ast.options.params) || Kd,
        p = (a && a.params) || Kd,
        h = this.buildStyles(r, p, d),
        g = (l && l.params) || Kd,
        M = this.buildStyles(i, g, d),
        A = new Set(),
        $ = new Map(),
        J = new Map(),
        ee = i === 'void',
        Ve = { params: ky(g, f), delay: this.ast.options?.delay },
        ge = u ? [] : Ly(e, n, this.ast.animation, o, s, h, M, Ve, c, d),
        me = 0;
      return (
        ge.forEach((Te) => {
          me = Math.max(Te.duration + Te.delay, me);
        }),
        d.length
          ? Ey(n, this._triggerName, r, i, ee, h, M, [], [], $, J, me, d)
          : (ge.forEach((Te) => {
              let en = Te.element,
                vn = pt($, en, new Set());
              Te.preStyleProps.forEach(($n) => vn.add($n));
              let bf = pt(J, en, new Set());
              Te.postStyleProps.forEach(($n) => bf.add($n)),
                en !== n && A.add(en);
            }),
            Ey(
              n,
              this._triggerName,
              r,
              i,
              ee,
              h,
              M,
              ge,
              [...A.values()],
              $,
              J,
              me,
            ))
      );
    }
  };
function ZM(t, e, n, r, i) {
  return t.some((o) => o(e, n, r, i));
}
function ky(t, e) {
  let n = C({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var lf = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = ky(e, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != 'string' &&
          o.forEach((s, a) => {
            s && (s = So(s, i, n));
            let l = this.normalizer.normalizePropertyName(a, n);
            (s = this.normalizer.normalizeStyleValue(a, l, s, n)), r.set(a, s);
          });
      }),
      r
    );
  }
};
function JM(t, e, n) {
  return new cf(t, e, n);
}
var cf = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let o = (i.options && i.options.params) || {};
        this.states.set(i.name, new lf(i.style, o, r));
      }),
      Cy(this.states, 'true', '1'),
      Cy(this.states, 'false', '0'),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new el(e, i, this.states));
      }),
      (this.fallbackTransition = XM(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((s) => s.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function XM(t, e, n) {
  let r = [(s, a) => !0],
    i = { type: k.Sequence, steps: [], options: null },
    o = {
      type: k.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new el(t, o, e);
}
function Cy(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var eA = new To(),
  uf = class {
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, n) {
      let r = [],
        i = [],
        o = Fy(this._driver, n, r, i);
      if (r.length) throw hM(r);
      i.length && void 0, this._animations.set(e, o);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        o = My(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, o, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        o = this._animations.get(e),
        s,
        a = new Map();
      if (
        (o
          ? ((s = Ly(
              this._driver,
              n,
              o,
              Ry,
              Jd,
              new Map(),
              new Map(),
              r,
              eA,
              i,
            )),
            s.forEach((u) => {
              let d = pt(a, u.element, new Map());
              u.postStyleProps.forEach((f) => d.set(f, null));
            }))
          : (i.push(gM()), (s = [])),
        i.length)
      )
        throw mM(i);
      a.forEach((u, d) => {
        u.forEach((f, p) => {
          u.set(p, this._driver.computeStyle(d, p, Jt));
        });
      });
      let l = s.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        c = Hn(l);
      return (
        this._playersById.set(e, c),
        c.onDestroy(() => this.destroy(e)),
        this.players.push(c),
        c
      );
    }
    destroy(e) {
      let n = this._getPlayer(e);
      n.destroy(), this._playersById.delete(e);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(e) {
      let n = this._playersById.get(e);
      if (!n) throw vM(e);
      return n;
    }
    listen(e, n, r, i) {
      let o = mf(n, '', '', '');
      return gf(this._getPlayer(e), r, o, i), () => {};
    }
    command(e, n, r, i) {
      if (r == 'register') {
        this.register(e, i[0]);
        return;
      }
      if (r == 'create') {
        let s = i[0] || {};
        this.create(e, n, s);
        return;
      }
      let o = this._getPlayer(e);
      switch (r) {
        case 'play':
          o.play();
          break;
        case 'pause':
          o.pause();
          break;
        case 'reset':
          o.reset();
          break;
        case 'restart':
          o.restart();
          break;
        case 'finish':
          o.finish();
          break;
        case 'init':
          o.init();
          break;
        case 'setPosition':
          o.setPosition(parseFloat(i[0]));
          break;
        case 'destroy':
          this.destroy(e);
          break;
      }
    }
  },
  by = 'ng-animate-queued',
  tA = '.ng-animate-queued',
  Qd = 'ng-animate-disabled',
  nA = '.ng-animate-disabled',
  rA = 'ng-star-inserted',
  iA = '.ng-star-inserted',
  oA = [],
  jy = {
    namespaceId: '',
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  sA = {
    namespaceId: '',
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  Pt = '__ng_removed',
  Mo = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = '') {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty('value'),
        i = r ? e.value : e;
      if (((this.value = lA(i)), r)) {
        let o = e,
          { value: s } = o,
          a = xf(o, ['value']);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let n = e.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  Io = 'void',
  Yd = new Mo(Io),
  df = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = 'ng-tns-' + e),
        bt(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw yM(r, n);
      if (r == null || r.length == 0) throw wM(n);
      if (!cA(r)) throw DM(r, n);
      let o = pt(this._elementListeners, e, []),
        s = { name: n, phase: r, callback: i };
      o.push(s);
      let a = pt(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (bt(e, $a), bt(e, $a + '-' + n), a.set(n, Yd)),
        () => {
          this._engine.afterFlush(() => {
            let l = o.indexOf(s);
            l >= 0 && o.splice(l, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw EM(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let o = this._getTrigger(n),
        s = new Ao(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (bt(e, $a),
        bt(e, $a + '-' + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let l = a.get(n),
        c = new Mo(r, this.id);
      if (
        (!(r && r.hasOwnProperty('value')) && l && c.absorbOptions(l.options),
        a.set(n, c),
        l || (l = Yd),
        !(c.value === Io) && l.value === c.value)
      ) {
        if (!fA(l.params, c.params)) {
          let g = [],
            M = o.matchStyles(l.value, l.params, g),
            A = o.matchStyles(c.value, c.params, g);
          g.length
            ? this._engine.reportError(g)
            : this._engine.afterFlush(() => {
                mr(e, M), Xt(e, A);
              });
        }
        return;
      }
      let f = pt(this._engine.playersByElement, e, []);
      f.forEach((g) => {
        g.namespaceId == this.id &&
          g.triggerName == n &&
          g.queued &&
          g.destroy();
      });
      let p = o.matchTransition(l.value, c.value, e, c.params),
        h = !1;
      if (!p) {
        if (!i) return;
        (p = o.fallbackTransition), (h = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: p,
          fromState: l,
          toState: c,
          player: s,
          isFallbackTransition: h,
        }),
        h ||
          (bt(e, by),
          s.onStart(() => {
            pi(e, by);
          })),
        s.onDone(() => {
          let g = this.players.indexOf(s);
          g >= 0 && this.players.splice(g, 1);
          let M = this._engine.playersByElement.get(e);
          if (M) {
            let A = M.indexOf(s);
            A >= 0 && M.splice(A, 1);
          }
        }),
        this.players.push(s),
        f.push(s),
        s
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((n) => n.delete(e)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != e),
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let n = this._engine.playersByElement.get(e);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, n) {
      let r = this._engine.driver.query(e, Ka, !0);
      r.forEach((i) => {
        if (i[Pt]) return;
        let o = this._engine.fetchNamespacesByElement(i);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i)),
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let o = this._engine.statesByElement.get(e),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((l, c) => {
            if ((s.set(c, l.value), this._triggers.has(c))) {
              let u = this.trigger(e, c, Io, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, s),
            r && Hn(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let n = this._elementListeners.get(e),
        r = this._engine.statesByElement.get(e);
      if (n && r) {
        let i = new Set();
        n.forEach((o) => {
          let s = o.name;
          if (i.has(s)) return;
          i.add(s);
          let l = this._triggers.get(s).fallbackTransition,
            c = r.get(s) || Yd,
            u = new Mo(Io),
            d = new Ao(this.id, s, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: s,
              transition: l,
              fromState: c,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, n) {
      let r = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
        this.triggerLeaveAnimation(e, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let o = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (o && o.length) i = !0;
        else {
          let s = e;
          for (; (s = s.parentNode); )
            if (r.statesByElement.get(s)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let o = e[Pt];
        (!o || o === jy) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      bt(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let o = r.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == r.triggerName) {
                let l = mf(
                  o,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value,
                );
                (l._data = e), gf(r.player, a.phase, l, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let o = r.transition.ast.depCount,
            s = i.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(r.element, i.element)
              ? 1
              : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  ff = class {
    _onRemovalComplete(e, n) {
      this.onRemovalComplete(e, n);
    }
    constructor(e, n, r, i) {
      (this.bodyNode = e),
        (this.driver = n),
        (this._normalizer = r),
        (this.scheduler = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (o, s) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && e.push(r);
          });
        }),
        e
      );
    }
    createNamespace(e, n) {
      let r = new df(e, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[e] = r)
      );
    }
    _balanceNamespaceList(e, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let l = i.get(a);
          if (l) {
            let c = r.indexOf(l);
            r.splice(c + 1, 0, e), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || r.unshift(e);
      } else r.push(e);
      return i.set(n, e), e;
    }
    register(e, n) {
      let r = this._namespaceLookup[e];
      return r || (r = this.createNamespace(e, n)), r;
    }
    registerTrigger(e, n, r) {
      let i = this._namespaceLookup[e];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(e, n) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let n = new Set(),
        r = this.statesByElement.get(e);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let o = this._fetchNamespace(i.namespaceId);
            o && n.add(o);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (qa(n)) {
        let o = this._fetchNamespace(e);
        if (o) return o.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!qa(n)) return;
      let o = n[Pt];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(n);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (e) {
        let s = this._fetchNamespace(e);
        s && s.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), bt(e, Qd))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), pi(e, Qd));
    }
    removeNode(e, n, r) {
      if (qa(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let o = this.namespacesByHostElement.get(n);
        o && o.id !== e && o.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, o) {
      this.collectedLeaveElements.push(n),
        (n[Pt] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(e, n, r, i, o) {
      return qa(n) ? this._fetchNamespace(e).listen(n, r, i, o) : () => {};
    }
    _buildInstruction(e, n, r, i, o) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        r,
        i,
        e.fromState.options,
        e.toState.options,
        n,
        o,
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, Ka, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Xd, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(e) {
      let n = this.playersByElement.get(e);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let n = this.playersByQueriedElement.get(e);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return Hn(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[Pt];
      if (n && n.setForRemoval) {
        if (((e[Pt] = jy), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(Qd) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, nA, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(e = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i),
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          bt(i, rA);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, e);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? Hn(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw CM(e);
    }
    _flushAnimations(e, n) {
      let r = new To(),
        i = [],
        o = new Map(),
        s = [],
        a = new Map(),
        l = new Map(),
        c = new Map(),
        u = new Set();
      this.disabledNodes.forEach((_) => {
        u.add(_);
        let T = this.driver.query(_, tA, !0);
        for (let N = 0; N < T.length; N++) u.add(T[N]);
      });
      let d = this.bodyNode,
        f = Array.from(this.statesByElement.keys()),
        p = Sy(f, this.collectedEnterElements),
        h = new Map(),
        g = 0;
      p.forEach((_, T) => {
        let N = Ry + g++;
        h.set(T, N), _.forEach((X) => bt(X, N));
      });
      let M = [],
        A = new Set(),
        $ = new Set();
      for (let _ = 0; _ < this.collectedLeaveElements.length; _++) {
        let T = this.collectedLeaveElements[_],
          N = T[Pt];
        N &&
          N.setForRemoval &&
          (M.push(T),
          A.add(T),
          N.hasAnimation
            ? this.driver.query(T, iA, !0).forEach((X) => A.add(X))
            : $.add(T));
      }
      let J = new Map(),
        ee = Sy(f, Array.from(A));
      ee.forEach((_, T) => {
        let N = Jd + g++;
        J.set(T, N), _.forEach((X) => bt(X, N));
      }),
        e.push(() => {
          p.forEach((_, T) => {
            let N = h.get(T);
            _.forEach((X) => pi(X, N));
          }),
            ee.forEach((_, T) => {
              let N = J.get(T);
              _.forEach((X) => pi(X, N));
            }),
            M.forEach((_) => {
              this.processLeaveNode(_);
            });
        });
      let Ve = [],
        ge = [];
      for (let _ = this._namespaceList.length - 1; _ >= 0; _--)
        this._namespaceList[_].drainQueuedTransitions(n).forEach((N) => {
          let X = N.player,
            Me = N.element;
          if ((Ve.push(X), this.collectedEnterElements.length)) {
            let Ue = Me[Pt];
            if (Ue && Ue.setForMove) {
              if (
                Ue.previousTriggersValues &&
                Ue.previousTriggersValues.has(N.triggerName)
              ) {
                let zn = Ue.previousTriggersValues.get(N.triggerName),
                  ht = this.statesByElement.get(N.element);
                if (ht && ht.has(N.triggerName)) {
                  let xo = ht.get(N.triggerName);
                  (xo.value = zn), ht.set(N.triggerName, xo);
                }
              }
              X.destroy();
              return;
            }
          }
          let Ft = !d || !this.driver.containsElement(d, Me),
            tt = J.get(Me),
            yn = h.get(Me),
            fe = this._buildInstruction(N, r, yn, tt, Ft);
          if (fe.errors && fe.errors.length) {
            ge.push(fe);
            return;
          }
          if (Ft) {
            X.onStart(() => mr(Me, fe.fromStyles)),
              X.onDestroy(() => Xt(Me, fe.toStyles)),
              i.push(X);
            return;
          }
          if (N.isFallbackTransition) {
            X.onStart(() => mr(Me, fe.fromStyles)),
              X.onDestroy(() => Xt(Me, fe.toStyles)),
              i.push(X);
            return;
          }
          let Sf = [];
          fe.timelines.forEach((Ue) => {
            (Ue.stretchStartingKeyframe = !0),
              this.disabledNodes.has(Ue.element) || Sf.push(Ue);
          }),
            (fe.timelines = Sf),
            r.append(Me, fe.timelines);
          let Xy = { instruction: fe, player: X, element: Me };
          s.push(Xy),
            fe.queriedElements.forEach((Ue) => pt(a, Ue, []).push(X)),
            fe.preStyleProps.forEach((Ue, zn) => {
              if (Ue.size) {
                let ht = l.get(zn);
                ht || l.set(zn, (ht = new Set())),
                  Ue.forEach((xo, sl) => ht.add(sl));
              }
            }),
            fe.postStyleProps.forEach((Ue, zn) => {
              let ht = c.get(zn);
              ht || c.set(zn, (ht = new Set())),
                Ue.forEach((xo, sl) => ht.add(sl));
            });
        });
      if (ge.length) {
        let _ = [];
        ge.forEach((T) => {
          _.push(bM(T.triggerName, T.errors));
        }),
          Ve.forEach((T) => T.destroy()),
          this.reportError(_);
      }
      let me = new Map(),
        Te = new Map();
      s.forEach((_) => {
        let T = _.element;
        r.has(T) &&
          (Te.set(T, T),
          this._beforeAnimationBuild(_.player.namespaceId, _.instruction, me));
      }),
        i.forEach((_) => {
          let T = _.element;
          this._getPreviousPlayers(
            T,
            !1,
            _.namespaceId,
            _.triggerName,
            null,
          ).forEach((X) => {
            pt(me, T, []).push(X), X.destroy();
          });
        });
      let en = M.filter((_) => Ty(_, l, c)),
        vn = new Map();
      Iy(vn, this.driver, $, c, Jt).forEach((_) => {
        Ty(_, l, c) && en.push(_);
      });
      let $n = new Map();
      p.forEach((_, T) => {
        Iy($n, this.driver, new Set(_), l, Ha);
      }),
        en.forEach((_) => {
          let T = vn.get(_),
            N = $n.get(_);
          vn.set(
            _,
            new Map([...(T?.entries() ?? []), ...(N?.entries() ?? [])]),
          );
        });
      let ol = [],
        _f = [],
        If = {};
      s.forEach((_) => {
        let { element: T, player: N, instruction: X } = _;
        if (r.has(T)) {
          if (u.has(T)) {
            N.onDestroy(() => Xt(T, X.toStyles)),
              (N.disabled = !0),
              N.overrideTotalTime(X.totalTime),
              i.push(N);
            return;
          }
          let Me = If;
          if (Te.size > 1) {
            let tt = T,
              yn = [];
            for (; (tt = tt.parentNode); ) {
              let fe = Te.get(tt);
              if (fe) {
                Me = fe;
                break;
              }
              yn.push(tt);
            }
            yn.forEach((fe) => Te.set(fe, Me));
          }
          let Ft = this._buildAnimation(N.namespaceId, X, me, o, $n, vn);
          if ((N.setRealPlayer(Ft), Me === If)) ol.push(N);
          else {
            let tt = this.playersByElement.get(Me);
            tt && tt.length && (N.parentPlayer = Hn(tt)), i.push(N);
          }
        } else
          mr(T, X.fromStyles),
            N.onDestroy(() => Xt(T, X.toStyles)),
            _f.push(N),
            u.has(T) && i.push(N);
      }),
        _f.forEach((_) => {
          let T = o.get(_.element);
          if (T && T.length) {
            let N = Hn(T);
            _.setRealPlayer(N);
          }
        }),
        i.forEach((_) => {
          _.parentPlayer ? _.syncPlayerEvents(_.parentPlayer) : _.destroy();
        });
      for (let _ = 0; _ < M.length; _++) {
        let T = M[_],
          N = T[Pt];
        if ((pi(T, Jd), N && N.hasAnimation)) continue;
        let X = [];
        if (a.size) {
          let Ft = a.get(T);
          Ft && Ft.length && X.push(...Ft);
          let tt = this.driver.query(T, Xd, !0);
          for (let yn = 0; yn < tt.length; yn++) {
            let fe = a.get(tt[yn]);
            fe && fe.length && X.push(...fe);
          }
        }
        let Me = X.filter((Ft) => !Ft.destroyed);
        Me.length ? uA(this, T, Me) : this.processLeaveNode(T);
      }
      return (
        (M.length = 0),
        ol.forEach((_) => {
          this.players.push(_),
            _.onDone(() => {
              _.destroy();
              let T = this.players.indexOf(_);
              this.players.splice(T, 1);
            }),
            _.play();
        }),
        ol
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, o) {
      let s = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let l = !o || o == Io;
          a.forEach((c) => {
            c.queued || (!l && c.triggerName != i) || s.push(c);
          });
        }
      }
      return (
        (r || i) &&
          (s = s.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName)),
          )),
        s
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        o = n.element,
        s = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let l of n.timelines) {
        let c = l.element,
          u = c !== o,
          d = pt(r, c, []);
        this._getPreviousPlayers(c, u, s, a, n.toState).forEach((p) => {
          let h = p.getRealPlayer();
          h.beforeDestroy && h.beforeDestroy(), p.destroy(), d.push(p);
        });
      }
      mr(o, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, o, s) {
      let a = n.triggerName,
        l = n.element,
        c = [],
        u = new Set(),
        d = new Set(),
        f = n.timelines.map((h) => {
          let g = h.element;
          u.add(g);
          let M = g[Pt];
          if (M && M.removedBeforeQueried) return new Un(h.duration, h.delay);
          let A = g !== l,
            $ = dA((r.get(g) || oA).map((me) => me.getRealPlayer())).filter(
              (me) => {
                let Te = me;
                return Te.element ? Te.element === g : !1;
              },
            ),
            J = o.get(g),
            ee = s.get(g),
            Ve = My(this._normalizer, h.keyframes, J, ee),
            ge = this._buildPlayer(h, Ve, $);
          if ((h.subTimeline && i && d.add(g), A)) {
            let me = new Ao(e, a, g);
            me.setRealPlayer(ge), c.push(me);
          }
          return ge;
        });
      c.forEach((h) => {
        pt(this.playersByQueriedElement, h.element, []).push(h),
          h.onDone(() => aA(this.playersByQueriedElement, h.element, h));
      }),
        u.forEach((h) => bt(h, vy));
      let p = Hn(f);
      return (
        p.onDestroy(() => {
          u.forEach((h) => pi(h, vy)), Xt(l, n.toStyles);
        }),
        d.forEach((h) => {
          pt(i, h, []).push(p);
        }),
        p
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new Un(e.duration, e.delay);
    }
  },
  Ao = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new Un()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => gf(e, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let n = this._player;
      n.triggerCallback && e.onStart(() => n.triggerCallback('start')),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, n) {
      pt(this._queuedCallbacks, e, []).push(n);
    }
    onDone(e) {
      this.queued && this._queueEvent('done', e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent('start', e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent('destroy', e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(e);
    }
  };
function aA(t, e, n) {
  let r = t.get(e);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && t.delete(e);
  }
  return r;
}
function lA(t) {
  return t ?? null;
}
function qa(t) {
  return t && t.nodeType === 1;
}
function cA(t) {
  return t == 'start' || t == 'done';
}
function _y(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? 'none'), n;
}
function Iy(t, e, n, r, i) {
  let o = [];
  n.forEach((l) => o.push(_y(l)));
  let s = [];
  r.forEach((l, c) => {
    let u = new Map();
    l.forEach((d) => {
      let f = e.computeStyle(c, d, i);
      u.set(d, f), (!f || f.length == 0) && ((c[Pt] = sA), s.push(c));
    }),
      t.set(c, u);
  });
  let a = 0;
  return n.forEach((l) => _y(l, o[a++])), s;
}
function Sy(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    o = new Map();
  function s(a) {
    if (!a) return r;
    let l = o.get(a);
    if (l) return l;
    let c = a.parentNode;
    return n.has(c) ? (l = c) : i.has(c) ? (l = r) : (l = s(c)), o.set(a, l), l;
  }
  return (
    e.forEach((a) => {
      let l = s(a);
      l !== r && n.get(l).push(a);
    }),
    n
  );
}
function bt(t, e) {
  t.classList?.add(e);
}
function pi(t, e) {
  t.classList?.remove(e);
}
function uA(t, e, n) {
  Hn(n).onDone(() => t.processLeaveNode(e));
}
function dA(t) {
  let e = [];
  return By(t, e), e;
}
function By(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof bo ? By(r.players, e) : e.push(r);
  }
}
function fA(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let o = n[i];
    if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
function Ty(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((o) => i.add(o)) : e.set(t, r), n.delete(t), !0;
}
var gi = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (o, s) => {}),
      (this._transitionEngine = new ff(e.body, n, r, i)),
      (this._timelineEngine = new uf(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (o, s) =>
        this.onRemovalComplete(o, s));
  }
  registerTrigger(e, n, r, i, o) {
    let s = e + '-' + i,
      a = this._triggerCache[s];
    if (!a) {
      let l = [],
        c = [],
        u = Fy(this._driver, o, l, c);
      if (l.length) throw fM(i, l);
      c.length && void 0,
        (a = JM(i, u, this._normalizer)),
        (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(e, n) {
    this._transitionEngine.register(e, n);
  }
  destroy(e, n) {
    this._transitionEngine.destroy(e, n);
  }
  onInsert(e, n, r, i) {
    this._transitionEngine.insertNode(e, n, r, i);
  }
  onRemove(e, n, r) {
    this._transitionEngine.removeNode(e, n, r);
  }
  disableAnimations(e, n) {
    this._transitionEngine.markElementAsDisabled(e, n);
  }
  process(e, n, r, i) {
    if (r.charAt(0) == '@') {
      let [o, s] = gy(r),
        a = i;
      this._timelineEngine.command(o, n, s, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, o) {
    if (r.charAt(0) == '@') {
      let [s, a] = gy(r);
      return this._timelineEngine.listen(s, n, a, o);
    }
    return this._transitionEngine.listen(e, n, r, i, o);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function pA(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = Zd(e[0])), e.length > 1 && (r = Zd(e[e.length - 1])))
      : e instanceof Map && (n = Zd(e)),
    n || r ? new pf(t, n, r) : null
  );
}
var hi = class hi {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = hi.initialStylesByElement.get(e);
    i || hi.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        Xt(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (Xt(this._element, this._initialStyles),
        this._endStyles &&
          (Xt(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (hi.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (mr(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (mr(this._element, this._endStyles), (this._endStyles = null)),
        Xt(this._element, this._initialStyles),
        (this._state = 3));
  }
};
hi.initialStylesByElement = new WeakMap();
var pf = hi;
function Zd(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      hA(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function hA(t) {
  return t === 'display' || t === 'position';
}
var tl = class {
    constructor(e, n, r, i) {
      (this.element = e),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options,
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener('finish', n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener('finish', n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let n = [];
      return (
        e.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(e, n, r) {
      return e.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== 'offset' && e.set(i, this._finished ? r : Df(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === 'start' ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  nl = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, n) {
      return !1;
    }
    containsElement(e, n) {
      return Ay(e, n);
    }
    getParentElement(e) {
      return vf(e);
    }
    query(e, n, r) {
      return xy(e, n, r);
    }
    computeStyle(e, n, r) {
      return Df(e, n);
    }
    animate(e, n, r, i, o, s = []) {
      let a = i == 0 ? 'both' : 'forwards',
        l = { duration: r, delay: i, fill: a };
      o && (l.easing = o);
      let c = new Map(),
        u = s.filter((p) => p instanceof tl);
      PM(r, i) &&
        u.forEach((p) => {
          p.currentSnapshot.forEach((h, g) => c.set(g, h));
        });
      let d = NM(n).map((p) => new Map(p));
      d = FM(e, d, c);
      let f = pA(e, d);
      return new tl(e, d, l, f);
    }
  };
var Ga = '@',
  Vy = '@.disabled',
  rl = class {
    constructor(e, n, r, i) {
      (this.namespaceId = e),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, n) {
      return this.delegate.createElement(e, n);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, n) {
      this.delegate.appendChild(e, n),
        this.engine.onInsert(this.namespaceId, n, e, !1);
    }
    insertBefore(e, n, r, i = !0) {
      this.delegate.insertBefore(e, n, r),
        this.engine.onInsert(this.namespaceId, n, e, i);
    }
    removeChild(e, n, r) {
      this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(e, n) {
      return this.delegate.selectRootElement(e, n);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, n, r, i) {
      this.delegate.setAttribute(e, n, r, i);
    }
    removeAttribute(e, n, r) {
      this.delegate.removeAttribute(e, n, r);
    }
    addClass(e, n) {
      this.delegate.addClass(e, n);
    }
    removeClass(e, n) {
      this.delegate.removeClass(e, n);
    }
    setStyle(e, n, r, i) {
      this.delegate.setStyle(e, n, r, i);
    }
    removeStyle(e, n, r) {
      this.delegate.removeStyle(e, n, r);
    }
    setProperty(e, n, r) {
      n.charAt(0) == Ga && n == Vy
        ? this.disableAnimations(e, !!r)
        : this.delegate.setProperty(e, n, r);
    }
    setValue(e, n) {
      this.delegate.setValue(e, n);
    }
    listen(e, n, r) {
      return this.delegate.listen(e, n, r);
    }
    disableAnimations(e, n) {
      this.engine.disableAnimations(e, n);
    }
  },
  hf = class extends rl {
    constructor(e, n, r, i, o) {
      super(n, r, i, o), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == Ga
        ? n.charAt(1) == '.' && n == Vy
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == Ga) {
        let i = gA(e),
          o = n.slice(1),
          s = '';
        return (
          o.charAt(0) != Ga && ([o, s] = mA(o)),
          this.engine.listen(this.namespaceId, i, o, s, (a) => {
            let l = a._data || -1;
            this.factory.scheduleListenerCallback(l, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function gA(t) {
  switch (t) {
    case 'body':
      return document.body;
    case 'document':
      return document;
    case 'window':
      return window;
    default:
      return t;
  }
}
function mA(t) {
  let e = t.indexOf('.'),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var il = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, o) => {
        let s = o?.parentNode(i);
        s && o.removeChild(s, i);
      });
  }
  createRenderer(e, n) {
    let r = '',
      i = this.delegate.createRenderer(e, n);
    if (!e || !n?.data?.animation) {
      let c = this._rendererCache,
        u = c.get(i);
      if (!u) {
        let d = () => c.delete(i);
        (u = new rl(r, i, this.engine, d)), c.set(i, u);
      }
      return u;
    }
    let o = n.id,
      s = n.id + '-' + this._currentId;
    this._currentId++, this.engine.register(s, e);
    let a = (c) => {
      Array.isArray(c)
        ? c.forEach(a)
        : this.engine.registerTrigger(o, s, e, c.name, c);
    };
    return n.data.animation.forEach(a), new hf(this, s, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, n, r) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var yA = (() => {
  let e = class e extends gi {
    constructor(r, i, o) {
      super(r, i, o, D(Hr, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(x(de), x(vr), x(yr));
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function wA() {
  return new Ya();
}
function DA(t, e, n) {
  return new il(t, e, n);
}
var Hy = [
    { provide: yr, useFactory: wA },
    { provide: gi, useClass: yA },
    { provide: or, useFactory: DA, deps: [ga, gi, ne] },
  ],
  Uy = [
    { provide: vr, useFactory: () => new nl() },
    { provide: iu, useValue: 'BrowserAnimations' },
    ...Hy,
  ],
  EA = [
    { provide: vr, useClass: yf },
    { provide: iu, useValue: 'NoopAnimations' },
    ...Hy,
  ],
  $y = (() => {
    let e = class e {
      static withConfig(r) {
        return { ngModule: e, providers: r.disableAnimations ? EA : Uy };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = _e({ providers: Uy, imports: [qm] }));
    let t = e;
    return t;
  })();
var zy = (() => {
  let e = class e {
    canActivate() {
      return !0;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var Wy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-home-page']],
      standalone: !0,
      features: [q],
      decls: 3,
      vars: 0,
      consts: [[1, 'home']],
      template: function (i, o) {
        i & 1 && (w(0, 'section', 0)(1, 'h1'), B(2, 'Welcome!!!'), E()());
      },
    }));
  let t = e;
  return t;
})();
function CA(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 6), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function bA(t, e) {
  if ((t & 1 && (pe(0), S(1, CA, 1, 1, 'app-movie-card', 5), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.movies)('ngForTrackBy', n.trackByMovieId);
  }
}
function _A(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var qy = (() => {
  let e = class e {
    constructor(r) {
      (this.movieService = r), (this.movies = []);
    }
    ngOnInit() {
      this.movies = this.movieService.getNowPlayingMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-now-playing-page']],
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 2,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [1, 'title'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1)(1, 'h2', 2),
            B(2, 'Now Playing'),
            E(),
            w(3, 'div', 3),
            S(4, bA, 2, 2, 'ng-container', 4)(
              5,
              _A,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(6);
          y(4), m('ngIf', o.movies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
function IA(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 6), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function SA(t, e) {
  if ((t & 1 && (pe(0), S(1, IA, 1, 1, 'app-movie-card', 5), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.movies)('ngForTrackBy', n.trackByMovieId);
  }
}
function TA(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var Gy = (() => {
  let e = class e {
    constructor(r) {
      (this.movieService = r), (this.movies = []);
    }
    ngOnInit() {
      this.movies = this.movieService.getTopRatedMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-top-rate-page']],
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 2,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [1, 'title'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1)(1, 'h2', 2),
            B(2, 'Top Rate'),
            E(),
            w(3, 'div', 3),
            S(4, SA, 2, 2, 'ng-container', 4)(
              5,
              TA,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(6);
          y(4), m('ngIf', o.movies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
function MA(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 6), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function AA(t, e) {
  if ((t & 1 && (pe(0), S(1, MA, 1, 1, 'app-movie-card', 5), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.movies)('ngForTrackBy', n.trackByMovieId);
  }
}
function xA(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var Ky = (() => {
  let e = class e {
    constructor(r) {
      (this.movieService = r), (this.movies = []);
    }
    ngOnInit() {
      this.movies = this.movieService.getUpcomingMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-upcoming-page']],
      standalone: !0,
      features: [q],
      decls: 7,
      vars: 2,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [1, 'title'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1)(1, 'h2', 2),
            B(2, 'UpComing'),
            E(),
            w(3, 'div', 3),
            S(4, AA, 2, 2, 'ng-container', 4)(
              5,
              xA,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(6);
          y(4), m('ngIf', o.movies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
var Qy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-not-found-page']],
      standalone: !0,
      features: [q],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (w(0, 'p'), B(1, 'not-found-page works!'), E());
      },
    }));
  let t = e;
  return t;
})();
function NA(t, e) {
  if (
    (t & 1 &&
      (w(0, 'div')(1, 'h1'),
      B(2),
      E(),
      W(3, 'img', 2),
      w(4, 'p'),
      B(5),
      Jr(6, 'number'),
      E(),
      w(7, 'p'),
      B(8),
      Jr(9, 'duration'),
      E(),
      w(10, 'p'),
      B(11),
      E()()),
    t & 2)
  ) {
    let n,
      r = P();
    y(2),
      lt(r.movie.original_title),
      y(),
      Mu('alt', r.movie.original_title),
      m('src', 'https://image.tmdb.org/t/p/w500' + r.movie.backdrop_path, lu),
      y(2),
      Gt(
        '\u0420\u0435\u0439\u0442\u0438\u043D\u0433: ',
        na(6, 6, r.movie.vote_average, '1.0-0'),
        '',
      ),
      y(3),
      Gt(
        '\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C: ',
        ta(9, 9, (n = r.movie.duration) !== null && n !== void 0 ? n : 0),
        '',
      ),
      y(3),
      lt(r.movie.overview);
  }
}
var Yy = (() => {
  let e = class e {
    constructor(r, i) {
      (this.route = r),
        (this.movieService = i),
        (this.favoriteMovieListIds = []),
        (this.watchLaterMovieListIds = []);
    }
    ngOnInit() {
      let r = this.route.snapshot.paramMap.get('id');
      if (r !== null) {
        let i = +r;
        this.movie = this.movieService.getMovieById(i);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(et), b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-movie-details-page']],
      standalone: !0,
      features: [q],
      decls: 2,
      vars: 1,
      consts: [
        [1, 'movie-list', 'container', 'section'],
        [4, 'ngIf'],
        [3, 'src', 'alt'],
      ],
      template: function (i, o) {
        i & 1 && (w(0, 'section', 0), S(1, NA, 12, 11, 'div', 1), E()),
          i & 2 && (y(), m('ngIf', o.movie));
      },
      dependencies: [le, De, pa, ka],
      styles: [
        '.movie-details[_ngcontent-%COMP%]   .movie-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.movie-details[_ngcontent-%COMP%]   .favorite-btn[_ngcontent-%COMP%]{color:red}.movie-details[_ngcontent-%COMP%]   .watchlist-btn[_ngcontent-%COMP%]{color:purple}.movie-details[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:auto}.movie-details[_ngcontent-%COMP%]   .movie-info[_ngcontent-%COMP%]{margin-top:20px}',
      ],
    }));
  let t = e;
  return t;
})();
function RA(t, e) {
  t & 1 && (pe(0), w(1, 'h2', 5), B(2, 'Subsequently:'), E(), he());
}
function OA(t, e) {
  if ((t & 1 && W(0, 'app-movie-card', 7), t & 2)) {
    let n = e.$implicit;
    m('movie', n);
  }
}
function PA(t, e) {
  if ((t & 1 && (pe(0), S(1, OA, 1, 1, 'app-movie-card', 6), he()), t & 2)) {
    let n = P();
    y(), m('ngForOf', n.watchLaterMovies)('ngForTrackBy', n.trackByMovieId);
  }
}
function FA(t, e) {
  t & 1 && (w(0, 'p'), B(1, 'No movies available'), E());
}
var Zy = (() => {
  let e = class e {
    constructor(r, i) {
      (this.route = r), (this.movieService = i), (this.watchLaterMovies = []);
    }
    ngOnInit() {
      this.watchLaterMovies = this.movieService.getWatchLaterMovies();
    }
    trackByMovieId(r, i) {
      return i.id;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(b(et), b(Le));
  }),
    (e.ɵcmp = L({
      type: e,
      selectors: [['app-movie-watch-list-page']],
      standalone: !0,
      features: [q],
      decls: 6,
      vars: 3,
      consts: [
        ['noMovies', ''],
        [1, 'movie-list', 'container', 'section'],
        [4, 'ngIf'],
        [1, 'movie-cards', 'grid'],
        [4, 'ngIf', 'ngIfElse'],
        [1, 'title'],
        [3, 'movie', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
        [3, 'movie'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (w(0, 'section', 1),
            S(1, RA, 3, 0, 'ng-container', 2),
            w(2, 'div', 3),
            S(3, PA, 2, 2, 'ng-container', 4)(
              4,
              FA,
              2,
              0,
              'ng-template',
              null,
              0,
              Xe,
            ),
            E()()),
          i & 2)
        ) {
          let s = Je(5);
          y(),
            m('ngIf', o.watchLaterMovies.length > 0),
            y(2),
            m('ngIf', o.watchLaterMovies.length > 0)('ngIfElse', s);
        }
      },
      dependencies: [Ct, le, He, De],
    }));
  let t = e;
  return t;
})();
var Jy = [
  { path: '', component: Wy, canActivate: [zy] },
  { path: 'now-playing', component: qy },
  { path: 'popular', component: oy },
  { path: 'top-rate', component: Gy },
  { path: 'upcoming', component: Ky },
  { path: 'movie/:id', component: Yy },
  { path: 'favorites', component: sy },
  { path: 'watch-later', component: Zy },
  { path: '**', component: Qy },
];
zm(py, { providers: [Pv(Jy, Vd()), Uc($y)] }).catch((t) => console.error(t));
