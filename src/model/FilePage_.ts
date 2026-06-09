class FilePage_ {

    private files: File[];
    private cursor: string;
    private index: number;
    private reachEnd: boolean;

    constructor(book: Book, lastCursor: string) {

        const fileList = FileService_.listFiles(book, 100, lastCursor);

        if (fileList.items == null) {
            fileList.items = [];
        }

        this.files = Utils_.wrapObjects(new File(), fileList.items);
        for (const file of this.files) {
            file.book = book;
        }
        this.cursor = fileList.cursor;
        this.index = 0;
        if (this.files == null || this.files.length == 0 || this.cursor == null || this.cursor == "") {
            this.reachEnd = true;
        } else {
            this.reachEnd = false;
        }
    }

    public getCursor(): string {
        return this.cursor;
    }

    public hasNext(): boolean {
        return this.index < this.files.length;
    }

    public hasReachEnd(): boolean {
        return this.reachEnd;
    }

    public getIndex(): number {
        if (this.index >= this.files.length) {
            return 0;
        } else {
            return this.index;
        }
    }

    public setIndex(index: number) {
        this.index = index;
    }

    public next(): File {
        if (this.index < this.files.length) {
            const file = this.files[this.index];
            this.index++;
            return file;
        } else {
            return null;
        }
    }

}
