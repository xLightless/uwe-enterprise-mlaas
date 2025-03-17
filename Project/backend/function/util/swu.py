## helper functions to make the swagger doc decorators smaller and less obnoxious
from drf_yasg import openapi

##  TODO:
#  Support for nesting json/object inside these request/response functions

def request(*props):
    # quickly generates a request schema out of the given strings "name:type:required"
    # example: "email:string", "password:string", "optional:integer:o" (:o for optional)

    properties = {}
    required = []

    for prop in props:
        data = (prop+":").split(":")
        name = data[0]
        print("Type:",getattr(openapi,"TYPE_"+data[1].upper()))
        datatype = getattr(openapi,"TYPE_"+data[1].upper())
        properties[name] = openapi.Schema(type=datatype)

        if data[2].upper() != "O":
            required.append(name)

    return openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties=properties,
        required=required
    )

def response(*props):
    # quickly generates a response schema out of the given strings "name:type"
    # example: "email:string", "password:string"

    properties = {}

    for prop in props:
        data = prop.split(":")
        datatype = getattr(openapi,"TYPE_"+data[1].upper())
        properties[data[0]] = openapi.Schema(type=datatype)

    return openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties=properties,
    )
