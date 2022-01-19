/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDDISPLAYAPICTURE_H
#define DIALOGCOMMANDDISPLAYAPICTURE_H

#include "dialogcommand.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandDisplayAPicture
//
//  A dialog used for displaying a picture on screen.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandDisplayAPicture;
}

class DialogCommandDisplayAPicture : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandDisplayAPicture(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandDisplayAPicture();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    PrimitiveValue *m_valueID;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandDisplayAPicture *ui;

    void translate();
};

#endif // DIALOGCOMMANDDISPLAYAPICTURE_H
