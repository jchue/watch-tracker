import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const Transition = ({ children }) => {
  const { asPath } = useRouter();

  return (
    <AnimatePresence initial={true} exitBeforeEnter>
      <motion.div key={asPath} variants={variants} animate="in" initial="out" exit="out" className="h-full">
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Transition;
