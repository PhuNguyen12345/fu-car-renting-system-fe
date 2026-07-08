import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("group/calendar bg-white p-4 w-[340px]", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 w-full", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-10 w-10 p-0 select-none aria-disabled:opacity-50 hover:bg-gray-100 rounded-lg",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-10 w-10 p-0 select-none aria-disabled:opacity-50 hover:bg-gray-100 rounded-lg",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-10 w-full items-center justify-center",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-10 w-full items-center justify-center gap-1.5 text-base font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn("relative rounded-md", defaultClassNames.dropdown_root),
        dropdown: cn("absolute inset-0 bg-white opacity-0", defaultClassNames.dropdown),
        caption_label: cn("font-bold select-none text-lg", captionLayout === "label"
          ? ""
          : "flex items-center gap-1 rounded-md text-lg [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-500", defaultClassNames.caption_label),
        month_grid: cn("w-full border-collapse mt-4", defaultClassNames.month_grid),
        weekdays: cn("flex w-full", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md text-sm font-semibold text-gray-500 select-none py-2 text-center",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-12 select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-sm text-gray-500 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-md p-0 text-center select-none text-base",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-lg bg-fpt-blue/10 after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-fpt-blue/10",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-fpt-blue/10", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-lg bg-fpt-blue/10 after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-fpt-blue/10",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-lg bg-gray-100 text-gray-900 font-bold data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-300 aria-selected:text-gray-300",
          defaultClassNames.outside
        ),
        disabled: cn("text-gray-300 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("h-5 w-5 text-gray-600", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("h-5 w-5 text-gray-600", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("h-5 w-5", className)} {...props} />);
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="flex h-12 w-12 items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square h-auto w-full min-w-10 flex-col gap-1 border-0 leading-none font-medium hover:bg-gray-100 hover:text-gray-900 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-fpt-blue group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-fpt-blue/50 data-[range-end=true]:rounded-lg data-[range-end=true]:rounded-r-lg data-[range-end=true]:bg-fpt-blue data-[range-end=true]:text-white data-[range-end=true]:hover:bg-blue-700 data-[range-end=true]:hover:text-white data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-fpt-blue data-[range-start=true]:rounded-lg data-[range-start=true]:rounded-l-lg data-[range-start=true]:bg-fpt-blue data-[range-start=true]:text-white data-[range-start=true]:hover:bg-blue-700 data-[range-start=true]:hover:text-white data-[selected-single=true]:bg-fpt-blue data-[selected-single=true]:text-white [&>span]:text-base [&>span]:mt-1.5",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }
