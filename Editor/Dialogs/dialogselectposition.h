/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDTELEPORTOBJECTSELECT_H
#define DIALOGCOMMANDTELEPORTOBJECTSELECT_H

#include <QDialog>
#include <QModelIndex>
#include "treemapdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandTeleportObjectSelect
//
//  A dialog used for selecting a position for teleporting
//  (displaying the maps).
//
// -------------------------------------------------------

namespace Ui {
class DialogSelectPosition;
}

class DialogSelectPosition : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSelectPosition(int idMap, int x, int y, int yPlus, int z,
        QWidget *parent = nullptr);
    ~DialogSelectPosition();

    int idMap() const;
    QString mapName() const;
    int x() const;
    int y() const;
    int yPlus() const;
    int z() const;

    TreeMapTag * currentTag() const;

private:
    Ui::DialogSelectPosition *ui;

    void translate();

private slots:
    void accept();
};

#endif // DIALOGCOMMANDTELEPORTOBJECTSELECT_H
