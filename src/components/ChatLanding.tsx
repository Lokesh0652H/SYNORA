import MovingFish from '@/components/MovingFish';

export default function ChatLanding() {
  return <div className="chat-landing">
    <div className="chat-grid" aria-hidden="true" />
    <MovingFish />
    <div className="chat-landing-copy">
      <div className="eyebrow">YOUR RESEARCH, IN MOTION</div>
      <h2>What’s on your mind?</h2>
      <p>Ask anything about your sources and follow the ideas wherever they lead.</p>
    </div>
  </div>;
}
