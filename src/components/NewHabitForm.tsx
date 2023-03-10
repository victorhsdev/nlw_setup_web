import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import {motion} from "framer-motion";
import { toast } from "react-toastify";

const availableWeekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

interface NewHabitForm {
  closeDialogOnSubmission: () => void;
}

export function NewHabitForm({closeDialogOnSubmission}: NewHabitForm) {

  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [triggerFired, setTriggerFired] = useState<"save" | "saveAndClose" | null>(null);

  async function createNewHabit(event: FormEvent){
    event.preventDefault();

    if(!title || weekDays.length === 0) {
      toast.error('Preencha o título e pelomenos 1 dia!');
      return;
    }

    await api.post('habits', {
      title, 
      weekDays
    })
       
    setTitle('');
    setWeekDays([]);

    toast.success('Hábito criado com sucesso!');

    if(triggerFired === 'saveAndClose') {
      closeDialogOnSubmission();
    }
  }

  function handleCheckboxToggle(weekDayIndex: number) {

    if(weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState=>prevState.filter(weekDay=>weekDay !== weekDayIndex));
    }else{
      setWeekDays(prevState=>[...prevState, weekDayIndex]);
    }

  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu compromentimento?
      </label>

      <input
        type="text"
        id="title"
        value={title}
        onChange={event=>setTitle(event.target.value)}
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekday, index) => {
          return (
            <motion.div
              key={weekday} 
              tabIndex={-1}
              whileHover={{  scale: 1.05 }}
              transition={{ duration: 0.1 }}
            >
              <Checkbox.Root 
                className='flex items-center gap-3 group focus:outline-none'
                checked={weekDays.includes(index)}
                onCheckedChange={()=>handleCheckboxToggle(index)}
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background"
                >
                  <Checkbox.Indicator>
                    <Check
                      size={20}
                      className="text-white"
                    />
                  </Checkbox.Indicator>
                </div>

                <span
                  className="text-white leading-tight"
                >
                  {weekday}
                </span>

              </Checkbox.Root>
            </motion.div>
          )
        })}

      </div>

      <div className="w-full h-auto flex flex-row items-center justify-between gap-3">
        <button 
          type="submit"
          disabled={title.trim().length === 0 || weekDays.length === 0}
          className="flex-1 mt-6 rounded-lg p-4 flex items-center gap-3 font-semibold justify-center disabled:cursor-not-allowed disabled:bg-green-700 bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Check size={20} weight="bold" />
          Salvar
        </button>

        <button 
          type="submit"
          onClick={()=> {
            setTriggerFired("saveAndClose");
          }}
          disabled={title.trim().length === 0 || weekDays.length === 0}
          className="flex-1 mt-6 rounded-lg p-4 flex items-center gap-3 font-semibold justify-center disabled:cursor-not-allowed disabled:bg-green-700 bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Check size={20} weight="bold" />
          Salvar e fechar
        </button>
      </div>
    </form>
  )
}