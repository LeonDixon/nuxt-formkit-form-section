# TODO

This formkit plugin needs to cater for the nuxt content system which renders a form on content pages, content pages require a navigation to load the page which means you canont use multi step.
SSR needs to also be support in this plugin so it you can have fast loading times.

## what does this solves?
- stops steps from loading the first step and then navigating to the intended step.

## requirements
- formkit vue component
- takes an array of formkit schemas
- uses local storage to grab values from previous questions
- works with if logic

### loading data into the multi step
Data which is loaded into local storage is pulled out if it is from a multistep, each multistep has independaent local storage where it finds it data.
When the multistep is created, a prop with the schema will load the data into the input - this enables the form to display the questions of the form.
Once the form has the data, current step needs to load the data in the form so it can be used for prop and conditional logic in which it depends on.

## issues
need to be able to grab node values which are not currently rendered
I can create all of the dependant nodes which are behind the step the are currently looking at

### loading multiple steps at a time
#### issue
two steps on the page which are demands and coverpage, coverpage needs information regarding the demands data, if the step is displayed in another form that this is fine as it can grab the data, if not this poses and issue are the node will not exist in the tree.

#### solution
1. tell the other steps which steps are going to be rendered in the page, if the other steps aren't render then try and create the step if it doesn't exists so it is in the registry, this will be done via if logic which stops multiple nodes being added for the same step.



### using one form with multiple sections
On a page load, check to see if a form section is used, if so create a form node which will append the form nodes, once it is created, add the remaining form data from local storage 