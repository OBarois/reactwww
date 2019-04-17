const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
const bind = useGesture(({ down, delta }) => set({ xy: down ? delta : [0, 0] }))
return (
  <animated.div
    {...bind()}
    style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}
  />
)