/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPLUGIN_H
#define DIALOGSYSTEMPLUGIN_H

#include <QDialog>
#include "systemplugin.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemPlugin
//
//  A dialog used for editing the model of a system plugin.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemPlugin;
}

class DialogSystemPlugin : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemPlugin(SystemPlugin& plugin, QWidget *parent = nullptr);
    ~DialogSystemPlugin();

    void initialize();

protected:
    virtual void accept();

private:
    Ui::DialogSystemPlugin *ui;
    SystemPlugin& m_plugin;
    QString m_previousName;

public slots:
    void on_radioButtonEmpty_toggled(bool checked);
    void on_radioButtonLocal_toggled(bool checked);
    void on_radioButtonOnline_toggled(bool checked);
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMPLUGIN_H
