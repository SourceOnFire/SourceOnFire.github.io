---
title: "Crear un atributo C# personalizado en GDEngine 4"
description: "Crea un atributo personalizado C# en godot engine 4"
pubDate: "Jul 15 2024"
updatedDate: "Mar 21 2025"
heroImage: "/post/post-gd-attr.jpg"
tags: ["post"]
---

En este post, voy a mostrar como crear un atributo personalizado en Godot Engine 4.x utilizando C#.

Para este ejemplo, crearemos un atributo que se comporte como la función assert de gdscript para comprobar si el nodo no es nulo.

Empezamos creando una nueva clase que se llamara **NodeNotNull** que herede de **System.Attribute**


```cs

public class NodeNotNull : System.Attribute
{
}

```

Ya que utilizaremos este atributo en variables y propiedades de tipo Node, añadimos el siguiente atributo a nuestra clase.

```cs
[System.AttributeUsage(System.AttributeTargets.Property | 
System.AttributeTargets.Field)]
public class NodeNotNull : System.Attribute
{
}
```

Una vez añadido el atributo que nos permitirá acceder a variables y propiedades, vamos a añadir el constructor de nuestro atributo y el mensaje de error.


```cs
[System.AttributeUsage(System.AttributeTargets.Property | 
System.AttributeTargets.Field)]
public class NodeNotNull : System.Attribute
{
    private string _errorMessage = "";
    
    public NodeNotNull(string p_error_message)
    {
        _errorMessage = p_error_message;
    }
    
    public string GetErrorMessage() => _errorMessage;
}
```

Ya tenemos nuestro atributo personalizado, ahora falta hacer que funcione. Vamos a crear un singleton que recorra todo el árbol e inicie los atributos. 

Empezamos creando nuestra clase singleton o nodo global, ya que utilizaremos el sistema de Godot, no necesitamos implementar el patrón directamente en la clase. 

LLamaremos a nuestra clase AppMain y heredara de Node.

```cs
public partial class AppMain : Node
{
}
```

Vamos a necesitar usar las siguientes bibliotecas de C#: System, System.Collections.Generic, System.Reflection. Así que las añadimos.

```cs
using System;
using System.Collections.Generic;
using System.Reflection;

public partial class AppMain : Node
{
}
```

A continuación necesitamos acceder al árbol, por lo que lo obtenemos de la siguiente manera.

```cs
using System;
using System.Collections.Generic;
using System.Reflection;

public partial class AppMain : Node
{
    private SceneTree _tree;

    public override void _EnterTree()
    {
        _tree = GetTree();
    }
}
```

Haremos la comprobación justo cuando se añada cada nodo, por lo que necesitamos saber en que momento entra un nodo en el árbol para verificar si existe el atributo en dicho nodo.

```cs
using System;
using System.Collections.Generic;
using System.Reflection;

public partial class AppMain : Node
{
    private SceneTree _tree;

    public override void _EnterTree()
    {
        _tree = GetTree();
        _tree.NodeAdded += OnNodeAdded;
    }

    public override void _ExitTree()
    {
        _tree.NodeAdded -= OnNodeAdded;
    }

    private void OnNodeAdded(Node p_node)
    {

    }
}
```

Ahora necesitamos el método que compruebe que el nodo es nulo, imprima un error y que al mismo tiempo cierre la aplicación. Le llamaremos ***AssertNode***.

```cs
public static void AssertNode<T>(SceneTree p_tree, T p_node, 
string p_what = "", bool p_stopApp = true)
{
    if(p_node is null)
    {
        GD.PrintErr(p_what);
        if(p_stopApp)
            p_tree.Quit();
    }
}
```

Bueno, ahora creamos el método que inicialice los atributos, le llamaremos ***StartAttributes***.

```cs
private void StartAttributes(Node p_node)
{

}
```

Lo llamamos en el método ***OnNodeAdded*** y le pasamos el nodo que acaba de entrar al árbol.

```cs
private void OnNodeAdded(Node p_node)
{
    StartAttributes(p_node);
}
```

Ahora utilizamos Reflection para obtener las propiedades del nodo. Obtenemos propiedades, publicas y privadas.

```cs
private void StartAttributes(Node p_node)
{
    // Properties
    PropertyInfo[] props = p_node.GetType().GetProperties(
        BindingFlags.Instance | BindingFlags.Public |
        BindingFlags.NonPublic
    );
}
```

Recorremos las propiedades y obtenemos los atributos personalizados. Luego comprobamos que el atributo sea del tipo ***NodeNotNull***

```cs
foreach (PropertyInfo pInfo in props)
{
    IEnumerable<Attribute> attributes = pInfo.GetCustomAttributes();
    foreach (Attribute attr in attributes)
    {
        if (attr is NodeNotNull prop)
        {
   
        }
    }
}
```

Ahora podemos llamar a nuestro método ***AssertNode***. Le pasamos el árbol, el nodo y el mensaje de error en caso que el nodo sea nulo.

```cs
foreach (PropertyInfo pInfo in props)
{
    IEnumerable<Attribute> attributes = pInfo.GetCustomAttributes();
    foreach (Attribute attr in attributes)
    {
        if (attr is NodeNotNull prop)
        {
            AssertNode(
                _tree,
                pInfo.GetValue(p_node) as Node,
                $" El parametro '{pInfo.Name}' es requerido en el nodo '{p_node.Name}' {prop.GetErrorMessage()}"     
           );
        }
    }
}
```

Lo mismo que hicimos con las propiedades lo hacemos con los campos. Al final nuestro script quedaría de esta forma.

```cs
using System;
using System.Collections.Generic;
using System.Reflection;

public partial class AppMain : Node
{
    private SceneTree _tree;

    public override void _EnterTree()
    {
        _tree = GetTree();
        _tree.NodeAdded += OnNodeAdded;
    }

    public override void _ExitTree()
    {
        _tree.NodeAdded -= OnNodeAdded;
    }

    private void OnNodeAdded(Node p_node)
    {
        StartAttributes(p_node);
    }

    public static void AssertNode<T>(SceneTree p_tree, T p_node, 
    string p_what = "", bool p_stopApp = true)
    {

        if(p_node is null)
        {
            GD.PrintErr(p_what);
            if(p_stopApp)
                p_tree.Quit();
        }

    }

    private void StartAttributes(Node p_node)
    {
        // Properties
        PropertyInfo[] props = p_node.GetType().GetProperties(
            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
        );

        foreach (PropertyInfo pInfo in props)
        {
            IEnumerable<Attribute> attributes = pInfo.GetCustomAttributes();
            foreach (Attribute attr in attributes)
            {
                if (attr is NodeNotNull prop)
                {
                    AssertNode(
                        _tree,
                        pInfo.GetValue(p_node) as Node,
                        $" El parametro '{pInfo.Name}' es requerido en el nodo '{p_node.Name}' {prop.GetErrorMessage()}"
                    );
                }
            }
        }

        // Fiels
        FieldInfo[] fields = p_node.GetType().GetFields(
            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
        );

        foreach (FieldInfo fInfo in fields)
        {
            IEnumerable<Attribute> attributes = fInfo.GetCustomAttributes();
            foreach (Attribute attr in attributes)
            {
                if (attr is NodeNotNull prop)
                {
                    AssertNode(
                        _tree,
                        fInfo.GetValue(p_node) as Node,
                        $" El parametro '{fInfo.Name}' es requerido en el nodo '{p_node.Name}' {prop.GetErrorMessage()}"
                    );
                }
            }
        }
    }
}
```

Necesitamos convertir este nodo en un nodo global o Singleton, en godot es tan sencillo como ir a ***Proyect->ProyectSettings->Globals->Autoload*** y añadir el script a las lista. El motor se encargara de instanciar el nodo y permitir el acceso desde cualquier parte.

Ahora ya podemos probar nuestro atributo personalizado.

```cs
[Export]
[NodeNotNull("porfavor verifique")]
public Node3D myNode = null;
```
