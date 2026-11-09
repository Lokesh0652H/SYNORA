export default function AsciiMotion() {
  return <section className="motion-hero" aria-label="Synora dashboard introduction">
    <div className="motion-copy">
      <div className="eyebrow">A LITTLE MOMENT OF MOTION</div>
      <h2>Let your ideas<br/>find their <i>current.</i></h2>
      <p>Collect the pieces. Follow what moves you. See where the trail leads.</p>
    </div>
    <div className="ascii-stage">
      <div className="ascii-label">SYNORA FIELD NOTES <span>01 / 01</span></div>
      <div className="ascii-water" aria-hidden="true">~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~</div>
      <div className="shark-track" role="img" aria-label="A small animated ASCII shark swimming through the research workspace">
        <pre className="shark-frame shark-a">{`          .-""-.
    __..-’  o   /
.-'  (     __    }
 .-._   '--'  '--'
      '-.___.-'`}</pre>
        <pre className="shark-frame shark-b">{`          .-""-.
    __..-’  o   /
.-'  (     ___   }
 .-._   '--'  '--'
       '-.__.-'`}</pre>
      </div>
      <div className="ascii-water water-bottom" aria-hidden="true">~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~ &nbsp; ~</div>
      <div className="ascii-caption">A workspace with room to explore</div>
    </div>
  </section>;
}
