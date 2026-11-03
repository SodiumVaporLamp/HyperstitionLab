#!/usr/bin/env python3
# Checks the Mercator card and the “How to read the spiral” note: python3 vanishing/loxodrome_check.py
# If GROW in ui.js changes, the bearing changes too: cot(bearing) = ln(GROW) / 2π.
"""Integrate a constant-bearing course on a unit sphere by small steps (no Mercator formulas),
project it stereographically from the south pole onto the plane (view from above the north pole),
and test whether it is a logarithmic spiral with this page's pitch (radius x2.5 per turn)."""
import numpy as np
GROW = 2.5
# bearing that should give x2.5 per turn: cot(beta) = ln(GROW)/(2*pi)
beta_pred = np.degrees(np.arctan2(2*np.pi, np.log(GROW)))
print(f"predicted bearing off north: {beta_pred:.4f} deg  (= {90-beta_pred:.4f} deg off due east/west)")

def sail(bearing_deg, lat0=0.0, lon0=0.0, step=1e-5, nsteps=600000):
    b = np.radians(bearing_deg)
    lat, lon = np.radians(lat0), np.radians(lon0)
    lats, lons = [lat], [lon]
    for _ in range(nsteps):
        # RK2 on the ODE dlat/ds = cos b, dlon/ds = sin b / cos lat
        k1a, k1o = np.cos(b), np.sin(b)/np.cos(lat)
        la2 = lat + 0.5*step*k1a
        k2a, k2o = np.cos(b), np.sin(b)/np.cos(la2)
        lat += step*k2a; lon += step*k2o
        lats.append(lat); lons.append(lon)
        if lat > np.radians(89.5): break
    return np.array(lats), np.array(lons)

for name, bearing in [("north of WEST", 360-beta_pred), ("north of EAST", beta_pred)]:
    lat, lon = sail(bearing)
    # stereographic projection from the south pole: r = tan(pi/4 - lat/2), angle = lon (anticlockwise seen from above N pole)
    r = np.tan(np.pi/4 - lat/2)
    x, y = r*np.cos(lon), r*np.sin(lon)
    theta = np.unwrap(np.arctan2(y, x))
    # fit ln r = a + k*theta ; a log spiral is exactly linear
    k, a = np.polyfit(theta, np.log(r), 1)
    resid = np.log(r) - (a + k*theta)
    per_turn = np.exp(abs(k)*2*np.pi)
    # winding as the course approaches the pole (r shrinking): sign of dtheta
    wind = "anticlockwise" if np.sign(theta[-1]-theta[0]) > 0 else "clockwise"
    # angle between the curve and the radius, measured on the plane (should be constant)
    dx, dy = np.gradient(x), np.gradient(y)
    cosang = np.abs((x*dx + y*dy)/(np.hypot(x,y)*np.hypot(dx,dy)))
    ang = np.degrees(np.arccos(np.clip(cosang, -1, 1)))
    print(f"{name}: turns={abs(theta[-1]-theta[0])/(2*np.pi):.2f}  radius x{per_turn:.6f} per turn  "
          f"max |resid| of ln r = {np.abs(resid).max():.2e}  winds {wind} inward  "
          f"angle to radius {ang[10:-10].min():.4f}-{ang[10:-10].max():.4f} deg")

# the page's own spiral: r = R0*GROW**u, phi = -2*pi*u (clockwise as u falls), its angle to the radius
alpha = np.degrees(np.arctan(2*np.pi/np.log(GROW)))
print(f"page spiral: angle between curve and radius = {alpha:.4f} deg; winds clockwise inward (ui.js phiOf, pt)")
# complex-log check: Mercator coords from stereographic z: (lon, psi) with psi = -ln|z| ; page spiral under log is a line
u = np.linspace(-3, 1, 1000); z = GROW**u * np.exp(-1j*2*np.pi*u)
w = np.log(z)  # real = ln r, imag = arg
w_im = np.unwrap(np.angle(z))
k2, a2 = np.polyfit(w_im, w.real, 1)
print(f"complex log of the page spiral is a straight line: max dev {np.abs(w.real-(a2+k2*w_im)).max():.2e}")
