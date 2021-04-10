/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDFLASHSCREEN_H
#define DIALOGCOMMANDFLASHSCREEN_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandFlashScreen
//
//  A dialog used for flashing screen.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandFlashScreen;
}

class DialogCommandFlashScreen : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandFlashScreen(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandFlashScreen();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandFlashScreen *ui;

    void translate();
};

#endif // DIALOGCOMMANDFLASHSCREEN_H
