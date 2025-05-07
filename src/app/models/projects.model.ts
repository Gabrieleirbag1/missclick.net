export class Project {
  public _id: any;

  constructor(
    public title: string,
    public description: string[],
    public imageUrl: { grid: string; list: string },
    public link: string,
    public date: string,
    public tags: string[],
    public technologies: string[]
  ) {}

}
