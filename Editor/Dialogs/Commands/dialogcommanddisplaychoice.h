/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDISPLAYCHOICE_H
#define DIALOGCOMMANDDISPLAYCHOICE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandDisplayChoice
//
//  A dialog used for displaying choices.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandDisplayChoice;
}

class DialogCommandDisplayChoice : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandDisplayChoice(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr,QWidget *parent = nullptr);
    virtual ~DialogCommandDisplayChoice();

    void initializePrimitives();
    void initializeDefault();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_model;

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandDisplayChoice *ui;

    void translate();
};

#endif // DIALOGCOMMANDDISPLAYCHOICE_H
