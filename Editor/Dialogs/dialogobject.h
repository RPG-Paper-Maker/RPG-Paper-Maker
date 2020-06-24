/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGOBJECT_H
#define DIALOGOBJECT_H

#include <QDialog>
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogObject
//
//  A dialog used for creating / editing a local object.
//
// -------------------------------------------------------

namespace Ui {
class DialogObject;
}

class DialogObject : public QDialog
{
    Q_OBJECT

public:
    explicit DialogObject(SystemCommonObject* object, QWidget *parent = 0);
    ~DialogObject();

private:
    Ui::DialogObject *ui;

    void translate();
};

#endif // DIALOGOBJECT_H
