export interface ApiDishBase {
  name: string
  preparation_time: string
  type: string
}

export interface ApiPizza extends ApiDishBase {
  no_of_slices: number
  diameter: number
}

export interface ApiSoup extends ApiDishBase {
  spiciness_scale: number
}

export interface ApiSandwich extends ApiDishBase {
  slices_of_bread: number
}

export type ApiDish = ApiPizza | ApiSoup | ApiSandwich

export type ApiDishField = keyof ApiPizza | keyof ApiSoup | keyof ApiSandwich

export type ApiDishErrors = {
  [field in Partial<ApiDishField>]: string[]
}

export type FormDishErrors = {
  [field in keyof Partial<FormDish>]: string[]
}

export interface FormDish {
  name: string
  preparationTime: string
  type: string
  pizzaSlices: number
  pizzaDiameter: number
  soupSpicinessScale: number
  breadSlices: number
}

export function mapFormDishToApiDish(formDish: FormDish) {
  const apiDishBase: ApiDishBase = {
    name: formDish.name,
    preparation_time: formDish.preparationTime,
    type: formDish.type
  }

  switch (formDish.type) {
    case 'pizza': {
      const apiPizza: ApiPizza = {
        ...apiDishBase,
        no_of_slices: formDish.pizzaSlices,
        diameter: formDish.pizzaDiameter
      }

      return apiPizza
    }

    case 'soup': {
      const apiSoup: ApiSoup = {
        ...apiDishBase,
        spiciness_scale: formDish.soupSpicinessScale
      }

      return apiSoup
    }

    case 'sandwich': {
      const apiSandwich: ApiSandwich = {
        ...apiDishBase,
        slices_of_bread: formDish.breadSlices
      }

      return apiSandwich
    }
  }

  return null
}

const apiDishFieldToFormDishFieldMap: {
  [field in ApiDishField]: keyof FormDish
} = {
  name: 'name',
  preparation_time: 'preparationTime',
  type: 'type',
  no_of_slices: 'pizzaSlices',
  spiciness_scale: 'soupSpicinessScale',
  slices_of_bread: 'breadSlices',
  diameter: 'pizzaDiameter'
}

export function mapApiDishErrorsToFormErrors(apiDishErrors: ApiDishErrors) {
  const formErrors: FormDishErrors = {}
  for (const apiField in apiDishErrors) {
    const key =
      apiDishFieldToFormDishFieldMap[
        apiField as keyof typeof apiDishFieldToFormDishFieldMap
      ]
    formErrors[key] = apiDishErrors[apiField as keyof ApiDishErrors]
  }

  return formErrors
}
