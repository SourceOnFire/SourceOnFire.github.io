---
title: "Time Of Day"
description: "Plugin de cielo en dinámico y tiempo para GD Engine4"
pubDate: "Mar 21 2025"
updatedDate: "Mar 21 2025"
heroImage: "/addons/time-of-day.jpg"
tags: ["addon", "godot", "sky", "clouds", "plugin", "glsl", "gdscript"]
---

Plugin de cielo en tiempo real y tiempo para Godot Engine.

Para la dispersión del cielo actualmente utilizo un modelo basado en los papers de ATI Preetham and Hoffman, además del sol incluye dispersión de Mie para la luna y dispersión simplificada de Rayleigh para la noche.

El disco del sol utiliza un spot simple y una simplificación de la fase Mie. Para dibujar la luna utilizo Raytrace y una textura panorámica de la luna.

Las nubes son una simplificación de nubes hechas con raymach basadas en las nubes de Horizon Zero Dawn.

El plugin también tiene un sistema de calendario gregoriano, sincronización con el dispositivo y las posiciones del sol y la luna realistas basadas en cálculos astronómicos.

Para la versión 2.0 hay planeadas muchas mejoras.

<br><br>

<div class="text-center p-10">
<a 
href="https://github.com/j-c7/time-of-day" target=_bank 
class="text-center font-bold p-5 rounded-md bg-blue-600 hover:bg-blue-500"> 
    Descargar 
</a>
</div>
