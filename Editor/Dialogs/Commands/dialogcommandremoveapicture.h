/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDREMOVEAPICTURE_H
#define DIALOGCOMMANDREMOVEAPICTURE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandRemoveAPicture
//
//  A dialog used for removing a picture from index.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandRemoveAPicture;
}

class DialogCommandRemoveAPicture : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandRemoveAPicture(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandRemoveAPicture();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandRemoveAPicture *ui;

    void translate();
};

#endif // DIALOGCOMMANDREMOVEAPICTURE_H
