/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGOBJECT_H
