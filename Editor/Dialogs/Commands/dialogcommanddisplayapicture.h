/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDDISPLAYAPICTURE_H
#define DIALOGCOMMANDDISPLAYAPICTURE_H

#include "dialogcommand.h"

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
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandDisplayAPicture();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    SuperListItem *m_pictureID;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandDisplayAPicture *ui;
};

#endif // DIALOGCOMMANDDISPLAYAPICTURE_H
