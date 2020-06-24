/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMELEMENT_H
#define DIALOGSYSTEMELEMENT_H

#include <QDialog>
#include "systemelement.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemElement
//
//  A dialog used for editing the model of a system element.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemElement;
}

class DialogSystemElement : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemElement(SystemElement& element, QWidget *parent = 0);
    ~DialogSystemElement();
    SystemElement& element() const;

private:
    Ui::DialogSystemElement *ui;
    SystemElement& m_element;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMELEMENT_H
