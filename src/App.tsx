import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {
  ApiDishErrors,
  FormDish,
  FormDishErrors,
  mapApiDishErrorsToFormErrors,
  mapFormDishToApiDish
} from './types/dish'
import { addNewDishApi } from './api/newDishApi'

const DishSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  preparationTime: Yup.string()
    .matches(/\d\d:\d\d:\d\d/, 'Wrong format')
    .required('Required'),
  type: Yup.string().required('Required').oneOf(['pizza', 'soup', 'sandwich']),
  pizzaSlices: Yup.number().required('Required'),
  pizzaDiameter: Yup.number().required('Required'),
  soupSpicinessScale: Yup.number()
    .min(1, 'Too low value')
    .max(10, 'Too high value')
    .required('Required'),
  breadSlices: Yup.number().required('Required')
})

export const App: React.FC = () => {
  const [apiError, setApiError] = useState('')
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    handleReset,
    setValues,
    setFieldError
  } = useFormik({
    validationSchema: DishSchema,
    initialValues: {
      name: '',
      preparationTime: '',
      type: 'pizza',
      pizzaSlices: 6,
      pizzaDiameter: 42,
      soupSpicinessScale: 4,
      breadSlices: 20
    },
    onSubmit: async (values, { setSubmitting }) => {
      await addNewDish(values)
      setSubmitting(false)
    }
  })

  async function addNewDish(formDish: FormDish) {
    const apiDish = mapFormDishToApiDish(formDish)
    if (apiDish === null) return

    await addNewDishApi(apiDish)
      .then((res) => {
        setApiError('')
        alert('Dish added\n' + JSON.stringify(res.data, null, 2))
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 400) {
          const apiErrors = err.response.data as ApiDishErrors
          handleApiErrors(apiErrors)
        } else {
          setApiError('Error occurred. Try again later.')
        }
      })
  }

  function handleApiErrors(apiErrors: ApiDishErrors) {
    const formErrors = mapApiDishErrorsToFormErrors(apiErrors)
    for (const field in formErrors) {
      const fieldErrors = formErrors[field as keyof FormDishErrors]!
      if (fieldErrors?.length > 0) {
        setFieldError(field, fieldErrors[0])
      }
    }
  }

  return (
    <main className="flex flex-row justify-center m-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12 sm:w-[480px]">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              New dish
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add new meal to your cookbook right now!
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      My dish is:
                    </span>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="tomato soup with rice"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                  </div>
                </div>
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm m-2">{errors.name}</div>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="preparationTime"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Preparation time
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      type="text"
                      name="preparationTime"
                      id="preparationTime"
                      autoComplete="preparationTime"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="00:12:00 (hh:mm:ss)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.preparationTime}
                    />
                  </div>
                </div>
                {errors.preparationTime && touched.preparationTime && (
                  <div className="text-red-500 text-sm m-2">
                    {errors.preparationTime}
                  </div>
                )}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Type
                </label>
                <div className="mt-2">
                  <select
                    id="type"
                    name="type"
                    autoComplete="type"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      const value = e.target.value
                      setValues({
                        name: values.name,
                        preparationTime: values.preparationTime,
                        type: value,
                        pizzaSlices: 6,
                        pizzaDiameter: 42,
                        soupSpicinessScale: 4,
                        breadSlices: 20
                      })
                      handleChange(e)
                    }}
                    onBlur={handleBlur}
                    value={values.type}
                  >
                    <option>pizza</option>
                    <option>soup</option>
                    <option>sandwich</option>
                  </select>
                </div>
              </div>
            </div>
            {errors.type && touched.type && (
              <div className="text-red-500 text-sm m-2">{errors.type}</div>
            )}
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Customize your meal
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Adjust options accordingly.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {values.type === 'pizza' && (
                <>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="pizzaSlices"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Number of slices
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="number"
                          name="pizzaSlices"
                          id="pizzaSlices"
                          autoComplete="pizzaSlices"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pizzaSlices}
                        />
                      </div>
                      {errors.pizzaSlices && touched.pizzaSlices && (
                        <div className="text-red-500 text-sm m-2">
                          {errors.pizzaSlices}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="pizzaDiameter"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Diameter [cm]
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="number"
                          name="pizzaDiameter"
                          id="pizzaDiameter"
                          autoComplete="pizzaDiameter"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pizzaDiameter}
                        />
                      </div>
                      {errors.pizzaDiameter && touched.pizzaDiameter && (
                        <div className="text-red-500 text-sm m-2">
                          {errors.pizzaDiameter}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {values.type === 'soup' && (
                <>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="soupSpicinessScale"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Spiciness [1-10]
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="number"
                          name="soupSpicinessScale"
                          id="soupSpicinessScale"
                          autoComplete="soupSpicinessScale"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.soupSpicinessScale}
                        />
                      </div>
                      {errors.soupSpicinessScale &&
                        touched.soupSpicinessScale && (
                          <div className="text-red-500 text-sm m-2">
                            {errors.soupSpicinessScale}
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}

              {values.type === 'sandwich' && (
                <>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="breadSlices"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Number of slices
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="number"
                          name="breadSlices"
                          id="breadSlices"
                          autoComplete="breadSlices"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.breadSlices}
                        />
                      </div>
                      {errors.breadSlices && touched.breadSlices && (
                        <div className="text-red-500 text-sm m-2">
                          {errors.breadSlices}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {apiError !== '' && (
          <div className="text-red-500 text-sm m-2">{apiError}</div>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleReset}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  )
}
