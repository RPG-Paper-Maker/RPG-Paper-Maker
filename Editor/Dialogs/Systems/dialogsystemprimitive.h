/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPRIMITIVE_H
#define DIALOGSYSTEMPRIMITIVE_H

#include <QDialog>
#include "systemprimitive.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemFontSize
//
//  A dialog used for editing the model of a system font size.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemPrimitive;
}

class DialogSystemPrimitive : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemPrimitive(SystemPrimitive &prim, QWidget
        *parent = nullptr);
    ~DialogSystemPrimitive();

    void initializeNumberVariableDouble(QString title);

protected:
    SystemPrimitive &m_prim;

private:
    Ui::DialogSystemPrimitive *ui;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMPRIMITIVE_H
