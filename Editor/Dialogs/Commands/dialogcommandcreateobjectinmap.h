/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCREATEOBJECTINMAP_H
#define DIALOGCOMMANDCREATEOBJECTINMAP_H

#include <QDialog>

namespace Ui {
class DialogCommandCreateObjectInMap;
}

class DialogCommandCreateObjectInMap : public QDialog
{
    Q_OBJECT

public:
    explicit DialogCommandCreateObjectInMap(QWidget *parent = nullptr);
    ~DialogCommandCreateObjectInMap();



private:
    Ui::DialogCommandCreateObjectInMap *ui;
};

#endif // DIALOGCOMMANDCREATEOBJECTINMAP_H
