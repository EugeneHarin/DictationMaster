interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url: string | undefined;
}

export default async function DictationAudio({ url, className, ...rest }: ButtonProps) {
  if (url !== undefined) {
    return (
      <audio className="mt-2" controls>
        <source src={url} type="audio/mp3" />
      </audio>
    );
  } else {
    return(
      <div>Error fetching dictation audio</div>
    )
  }
}
