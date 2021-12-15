/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCHANGEGRAPHICS_H
#define DIALOGCHANGEGRAPHICS_H

#include <QDialog>
#include <QStandardItemModel>
#include "systemstate.h"

namespace Ui {
class DialogChangeGraphics;
}

class DialogChangeGraphics : public QDialog
{
    Q_OBJECT

public:
    explicit DialogChangeGraphics(PrimitiveValue *valueID, QStandardItemModel
        *properties, QStandardItemModel *parameters, int id = -1, int index = 0,
        bool dontChangeOrientation = false, int indexX = 0, int indexY = 0,
        QRect currentRect = QRect(), QWidget *parent = nullptr);
    ~DialogChangeGraphics();
    bool isValueID() const;
    int id() const;
    int indexX() const;
    int indexY() const;
    QRect currentRect() const;
    bool dontChangeOrientation() const;

    int getIndex() const;
    void translate();

private:
    Ui::DialogChangeGraphics *ui;
    SystemState m_state;
};

#endif // DIALOGCHANGEGRAPHICS_H
