import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { motion } from "framer-motion";
import { useState } from 'react';
import { HabitPopoverList } from "./HabitPopoverList";
import { ProgressBar } from './ProgressBar';

interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  defaultAmount?: number;
}

export function HabitDay({date, defaultCompleted = 0, defaultAmount = 0, ...props}: HabitDayProps) {

  const [completed, setCompleted] = useState(defaultCompleted);
  const [amount, setAmount] = useState(defaultAmount);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  function handleUpdateCompleted(completed: number) {
    setCompleted(completed);
  }

  function handleUpdateAmount(amount: number){
    setAmount(amount);
  }

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <motion.button
        tabIndex={-1}
        whileHover={{ 
          scale: 1.15,
        }}
        drag
        dragConstraints={{
          top: -2,
          left: -2,
          right: 2,
          bottom: 2
        }}

      >      
        <Popover.Trigger className={clsx('w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background', {
          'bg-zinc-900 border-zinc-800': completedPercentage === 0,
          'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 40,
          'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
          'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
          'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
          'bg-violet-500 border-violet-400': completedPercentage >= 80,

        })}></Popover.Trigger>
      </motion.button>
      
      <Popover.Portal>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{duration: 0.1}}
          viewport={{ once: true }}
        >
        
        <Popover.Content className='min-w-[20rem] p-6 rounded-2xl bg-zinc-900 flex flex-col outline-none'>
          <span className='font-semibold text-zinc-400'>{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPercentage}/>

          <HabitPopoverList date={date} updateAmount={handleUpdateAmount} updateCompleted={handleUpdateCompleted}/>

          <Popover.Arrow height={8} width={16} className='fill-zinc-900'/>
        </Popover.Content>
        </motion.div>
      </Popover.Portal>
    </Popover.Root>
  )
}