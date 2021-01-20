/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPLUGINCOMMAND_H
#define DIALOGSYSTEMPLUGINCOMMAND_H

#include <QDialog>
#include "systemplugincommand.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemPluginCommand
//
//  A dialog used for editing the model of a system plugin command.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemPluginCommand;
}

class DialogSystemPluginCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemPluginCommand(SystemPluginCommand &command, QWidget
        *parent = nullptr);
    ~DialogSystemPluginCommand();

    void initialize();

protected:
    virtual void accept();

private:
    Ui::DialogSystemPluginCommand *ui;
    SystemPluginCommand &m_command;
    QString m_previousName;
    QStandardItemModel *m_completeList;

    void translate();

public slots:
    void on_lineEditName_textEdited(const QString &text);
    void on_lineEditDescription_textEdited(const QString &text);
    void on_treeViewWindowClosed();
    void on_pluginParameterOpeningWindow();
};

#endif // DIALOGSYSTEMPLUGINCOMMAND_H
