/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCUSTOMSTRUCTUREELEMENT_H
#define DIALOGSYSTEMCUSTOMSTRUCTUREELEMENT_H

#include <QDialog>
#include "systemcustomstructureelement.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCustomStructureElement
//
//  A dialog used for editing the model of a system custom structure element.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCustomStructureElement;
}

class DialogSystemCustomStructureElement : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCustomStructureElement(SystemCustomStructureElement
        &element, QWidget *parent = nullptr);
    ~DialogSystemCustomStructureElement();

    void initialize();

protected:
    virtual void accept();

private:
    Ui::DialogSystemCustomStructureElement *ui;
    SystemCustomStructureElement &m_element;
    QString m_previousName;

    void translate();

public slots:
    void on_lineEditKey_textEdited(const QString &text);
    void on_lineEditDescription_textEdited(const QString &text);
};

#endif // DIALOGSYSTEMCUSTOMSTRUCTUREELEMENT_H
