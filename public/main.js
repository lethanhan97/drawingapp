/*! For license information please see main.js.LICENSE.txt */
(() => {
  'use strict';
  var r = function (t, n) {
    return (r =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (r, t) {
          r.__proto__ = t;
        }) ||
      function (r, t) {
        for (var n in t) t.hasOwnProperty(n) && (r[n] = t[n]);
      })(t, n);
  };
  function t(t, n) {
    function e() {
      this.constructor = t;
    }
    r(t, n),
      (t.prototype =
        null === n ? Object.create(n) : ((e.prototype = n.prototype), new e()));
  }
  function n(r) {
    return 'function' == typeof r;
  }
  var e = !1,
    o = {
      Promise: void 0,
      set useDeprecatedSynchronousErrorHandling(r) {
        r && new Error().stack, (e = r);
      },
      get useDeprecatedSynchronousErrorHandling() {
        return e;
      },
    };
  function i(r) {
    setTimeout(function () {
      throw r;
    }, 0);
  }
  var s = {
      closed: !0,
      next: function (r) {},
      error: function (r) {
        if (o.useDeprecatedSynchronousErrorHandling) throw r;
        i(r);
      },
      complete: function () {},
    },
    u = (function () {
      return (
        Array.isArray ||
        function (r) {
          return r && 'number' == typeof r.length;
        }
      );
    })(),
    c = (function () {
      function r(r) {
        return (
          Error.call(this),
          (this.message = r
            ? r.length +
              ' errors occurred during unsubscription:\n' +
              r
                .map(function (r, t) {
                  return t + 1 + ') ' + r.toString();
                })
                .join('\n  ')
            : ''),
          (this.name = 'UnsubscriptionError'),
          (this.errors = r),
          this
        );
      }
      return (r.prototype = Object.create(Error.prototype)), r;
    })(),
    a = (function () {
      function r(r) {
        (this.closed = !1),
          (this._parentOrParents = null),
          (this._subscriptions = null),
          r && ((this._ctorUnsubscribe = !0), (this._unsubscribe = r));
      }
      return (
        (r.prototype.unsubscribe = function () {
          var t;
          if (!this.closed) {
            var e,
              o = this,
              i = o._parentOrParents,
              s = o._ctorUnsubscribe,
              a = o._unsubscribe,
              f = o._subscriptions;
            if (
              ((this.closed = !0),
              (this._parentOrParents = null),
              (this._subscriptions = null),
              i instanceof r)
            )
              i.remove(this);
            else if (null !== i)
              for (var p = 0; p < i.length; ++p) i[p].remove(this);
            if (n(a)) {
              s && (this._unsubscribe = void 0);
              try {
                a.call(this);
              } catch (r) {
                t = r instanceof c ? h(r.errors) : [r];
              }
            }
            if (u(f)) {
              p = -1;
              for (var b = f.length; ++p < b; ) {
                var l = f[p];
                if (null !== (e = l) && 'object' == typeof e)
                  try {
                    l.unsubscribe();
                  } catch (r) {
                    (t = t || []),
                      r instanceof c ? (t = t.concat(h(r.errors))) : t.push(r);
                  }
              }
            }
            if (t) throw new c(t);
          }
        }),
        (r.prototype.add = function (t) {
          var n = t;
          if (!t) return r.EMPTY;
          switch (typeof t) {
            case 'function':
              n = new r(t);
            case 'object':
              if (n === this || n.closed || 'function' != typeof n.unsubscribe)
                return n;
              if (this.closed) return n.unsubscribe(), n;
              if (!(n instanceof r)) {
                var e = n;
                (n = new r())._subscriptions = [e];
              }
              break;
            default:
              throw new Error(
                'unrecognized teardown ' + t + ' added to Subscription.'
              );
          }
          var o = n._parentOrParents;
          if (null === o) n._parentOrParents = this;
          else if (o instanceof r) {
            if (o === this) return n;
            n._parentOrParents = [o, this];
          } else {
            if (-1 !== o.indexOf(this)) return n;
            o.push(this);
          }
          var i = this._subscriptions;
          return null === i ? (this._subscriptions = [n]) : i.push(n), n;
        }),
        (r.prototype.remove = function (r) {
          var t = this._subscriptions;
          if (t) {
            var n = t.indexOf(r);
            -1 !== n && t.splice(n, 1);
          }
        }),
        (r.EMPTY = (function (r) {
          return (r.closed = !0), r;
        })(new r())),
        r
      );
    })();
  function h(r) {
    return r.reduce(function (r, t) {
      return r.concat(t instanceof c ? t.errors : t);
    }, []);
  }
  var f = (function () {
      return 'function' == typeof Symbol
        ? Symbol('rxSubscriber')
        : '@@rxSubscriber_' + Math.random();
    })(),
    p = (function (r) {
      function n(t, e, o) {
        var i = r.call(this) || this;
        switch (
          ((i.syncErrorValue = null),
          (i.syncErrorThrown = !1),
          (i.syncErrorThrowable = !1),
          (i.isStopped = !1),
          arguments.length)
        ) {
          case 0:
            i.destination = s;
            break;
          case 1:
            if (!t) {
              i.destination = s;
              break;
            }
            if ('object' == typeof t) {
              t instanceof n
                ? ((i.syncErrorThrowable = t.syncErrorThrowable),
                  (i.destination = t),
                  t.add(i))
                : ((i.syncErrorThrowable = !0), (i.destination = new b(i, t)));
              break;
            }
          default:
            (i.syncErrorThrowable = !0), (i.destination = new b(i, t, e, o));
        }
        return i;
      }
      return (
        t(n, r),
        (n.prototype[f] = function () {
          return this;
        }),
        (n.create = function (r, t, e) {
          var o = new n(r, t, e);
          return (o.syncErrorThrowable = !1), o;
        }),
        (n.prototype.next = function (r) {
          this.isStopped || this._next(r);
        }),
        (n.prototype.error = function (r) {
          this.isStopped || ((this.isStopped = !0), this._error(r));
        }),
        (n.prototype.complete = function () {
          this.isStopped || ((this.isStopped = !0), this._complete());
        }),
        (n.prototype.unsubscribe = function () {
          this.closed ||
            ((this.isStopped = !0), r.prototype.unsubscribe.call(this));
        }),
        (n.prototype._next = function (r) {
          this.destination.next(r);
        }),
        (n.prototype._error = function (r) {
          this.destination.error(r), this.unsubscribe();
        }),
        (n.prototype._complete = function () {
          this.destination.complete(), this.unsubscribe();
        }),
        (n.prototype._unsubscribeAndRecycle = function () {
          var r = this._parentOrParents;
          return (
            (this._parentOrParents = null),
            this.unsubscribe(),
            (this.closed = !1),
            (this.isStopped = !1),
            (this._parentOrParents = r),
            this
          );
        }),
        n
      );
    })(a),
    b = (function (r) {
      function e(t, e, o, i) {
        var u,
          c = r.call(this) || this;
        c._parentSubscriber = t;
        var a = c;
        return (
          n(e)
            ? (u = e)
            : e &&
              ((u = e.next),
              (o = e.error),
              (i = e.complete),
              e !== s &&
                (n((a = Object.create(e)).unsubscribe) &&
                  c.add(a.unsubscribe.bind(a)),
                (a.unsubscribe = c.unsubscribe.bind(c)))),
          (c._context = a),
          (c._next = u),
          (c._error = o),
          (c._complete = i),
          c
        );
      }
      return (
        t(e, r),
        (e.prototype.next = function (r) {
          if (!this.isStopped && this._next) {
            var t = this._parentSubscriber;
            o.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
              ? this.__tryOrSetError(t, this._next, r) && this.unsubscribe()
              : this.__tryOrUnsub(this._next, r);
          }
        }),
        (e.prototype.error = function (r) {
          if (!this.isStopped) {
            var t = this._parentSubscriber,
              n = o.useDeprecatedSynchronousErrorHandling;
            if (this._error)
              n && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, this._error, r), this.unsubscribe())
                : (this.__tryOrUnsub(this._error, r), this.unsubscribe());
            else if (t.syncErrorThrowable)
              n ? ((t.syncErrorValue = r), (t.syncErrorThrown = !0)) : i(r),
                this.unsubscribe();
            else {
              if ((this.unsubscribe(), n)) throw r;
              i(r);
            }
          }
        }),
        (e.prototype.complete = function () {
          var r = this;
          if (!this.isStopped) {
            var t = this._parentSubscriber;
            if (this._complete) {
              var n = function () {
                return r._complete.call(r._context);
              };
              o.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, n), this.unsubscribe())
                : (this.__tryOrUnsub(n), this.unsubscribe());
            } else this.unsubscribe();
          }
        }),
        (e.prototype.__tryOrUnsub = function (r, t) {
          try {
            r.call(this._context, t);
          } catch (r) {
            if ((this.unsubscribe(), o.useDeprecatedSynchronousErrorHandling))
              throw r;
            i(r);
          }
        }),
        (e.prototype.__tryOrSetError = function (r, t, n) {
          if (!o.useDeprecatedSynchronousErrorHandling)
            throw new Error('bad call');
          try {
            t.call(this._context, n);
          } catch (t) {
            return o.useDeprecatedSynchronousErrorHandling
              ? ((r.syncErrorValue = t), (r.syncErrorThrown = !0), !0)
              : (i(t), !0);
          }
          return !1;
        }),
        (e.prototype._unsubscribe = function () {
          var r = this._parentSubscriber;
          (this._context = null),
            (this._parentSubscriber = null),
            r.unsubscribe();
        }),
        e
      );
    })(p),
    l = (function () {
      return (
        ('function' == typeof Symbol && Symbol.observable) || '@@observable'
      );
    })();
  function y(r) {
    return r;
  }
  function d(r) {
    return 0 === r.length
      ? y
      : 1 === r.length
      ? r[0]
      : function (t) {
          return r.reduce(function (r, t) {
            return t(r);
          }, t);
        };
  }
  var _ = (function () {
    function r(r) {
      (this._isScalar = !1), r && (this._subscribe = r);
    }
    return (
      (r.prototype.lift = function (t) {
        var n = new r();
        return (n.source = this), (n.operator = t), n;
      }),
      (r.prototype.subscribe = function (r, t, n) {
        var e = this.operator,
          i = (function (r, t, n) {
            if (r) {
              if (r instanceof p) return r;
              if (r[f]) return r[f]();
            }
            return r || t || n ? new p(r, t, n) : new p(s);
          })(r, t, n);
        if (
          (e
            ? i.add(e.call(i, this.source))
            : i.add(
                this.source ||
                  (o.useDeprecatedSynchronousErrorHandling &&
                    !i.syncErrorThrowable)
                  ? this._subscribe(i)
                  : this._trySubscribe(i)
              ),
          o.useDeprecatedSynchronousErrorHandling &&
            i.syncErrorThrowable &&
            ((i.syncErrorThrowable = !1), i.syncErrorThrown))
        )
          throw i.syncErrorValue;
        return i;
      }),
      (r.prototype._trySubscribe = function (r) {
        try {
          return this._subscribe(r);
        } catch (t) {
          o.useDeprecatedSynchronousErrorHandling &&
            ((r.syncErrorThrown = !0), (r.syncErrorValue = t)),
            (function (r) {
              for (; r; ) {
                var t = r,
                  n = t.closed,
                  e = t.destination,
                  o = t.isStopped;
                if (n || o) return !1;
                r = e && e instanceof p ? e : null;
              }
              return !0;
            })(r)
              ? r.error(t)
              : console.warn(t);
        }
      }),
      (r.prototype.forEach = function (r, t) {
        var n = this;
        return new (t = v(t))(function (t, e) {
          var o;
          o = n.subscribe(
            function (t) {
              try {
                r(t);
              } catch (r) {
                e(r), o && o.unsubscribe();
              }
            },
            e,
            t
          );
        });
      }),
      (r.prototype._subscribe = function (r) {
        var t = this.source;
        return t && t.subscribe(r);
      }),
      (r.prototype[l] = function () {
        return this;
      }),
      (r.prototype.pipe = function () {
        for (var r = [], t = 0; t < arguments.length; t++) r[t] = arguments[t];
        return 0 === r.length ? this : d(r)(this);
      }),
      (r.prototype.toPromise = function (r) {
        var t = this;
        return new (r = v(r))(function (r, n) {
          var e;
          t.subscribe(
            function (r) {
              return (e = r);
            },
            function (r) {
              return n(r);
            },
            function () {
              return r(e);
            }
          );
        });
      }),
      (r.create = function (t) {
        return new r(t);
      }),
      r
    );
  })();
  function v(r) {
    if ((r || (r = o.Promise || Promise), !r))
      throw new Error('no Promise impl found');
    return r;
  }
  var w = (function () {
      function r(r, t) {
        (this.project = r), (this.thisArg = t);
      }
      return (
        (r.prototype.call = function (r, t) {
          return t.subscribe(new E(r, this.project, this.thisArg));
        }),
        r
      );
    })(),
    E = (function (r) {
      function n(t, n, e) {
        var o = r.call(this, t) || this;
        return (o.project = n), (o.count = 0), (o.thisArg = e || o), o;
      }
      return (
        t(n, r),
        (n.prototype._next = function (r) {
          var t;
          try {
            t = this.project.call(this.thisArg, r, this.count++);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(t);
        }),
        n
      );
    })(p);
  function S(r, t, n, e, o) {
    var i;
    if (
      (function (r) {
        return (
          r &&
          'function' == typeof r.addEventListener &&
          'function' == typeof r.removeEventListener
        );
      })(r)
    ) {
      var s = r;
      r.addEventListener(t, n, o),
        (i = function () {
          return s.removeEventListener(t, n, o);
        });
    } else if (
      (function (r) {
        return r && 'function' == typeof r.on && 'function' == typeof r.off;
      })(r)
    ) {
      var u = r;
      r.on(t, n),
        (i = function () {
          return u.off(t, n);
        });
    } else if (
      (function (r) {
        return (
          r &&
          'function' == typeof r.addListener &&
          'function' == typeof r.removeListener
        );
      })(r)
    ) {
      var c = r;
      r.addListener(t, n),
        (i = function () {
          return c.removeListener(t, n);
        });
    } else {
      if (!r || !r.length) throw new TypeError('Invalid event target');
      for (var a = 0, h = r.length; a < h; a++) S(r[a], t, n, e, o);
    }
    e.add(i);
  }
  (function r(t, e, o, i) {
    return (
      n(o) && ((i = o), (o = void 0)),
      i
        ? r(t, e, o).pipe(
            ((s = function (r) {
              return u(r) ? i.apply(void 0, r) : i(r);
            }),
            function (r) {
              return r.lift(new w(s, undefined));
            })
          )
        : new _(function (r) {
            S(
              t,
              e,
              function (t) {
                arguments.length > 1
                  ? r.next(Array.prototype.slice.call(arguments))
                  : r.next(t);
              },
              r,
              o
            );
          })
    );
    var s;
  })(document, 'mousemove').subscribe((r) => console.log(r));
})();
